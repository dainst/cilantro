import logging
import jsonschema
import os
import datetime

from flask import Blueprint, url_for, jsonify, request

from service.errors import ApiError
from utils.celery_client import celery_app
from service.user.user_service import auth
from service.job.job import Job
from utils import job_db
from utils import json_validation


job_controller = Blueprint('job', __name__)


@job_controller.route('/jobs', methods=['GET'])
@auth.login_required
def job_list():
    """
    List jobs of the user.

    List jobs of the user updated less than a week ago and all jobs, which were
    not successful.
    If show_all_jobs is set True it returns all jobs.

    .. :quickref: Job Controller; List jobs of the user

    **Example request**:

    .. sourcecode:: http

        GET /jobs/ HTTP/1.1

    **Example response SUCCESS**:

    .. sourcecode:: http

        HTTP/1.1 200 OK

        [
            {
                "created": "Tue, 30 Oct 2018 14:06:32 GMT",
                "errors": [],
                "job_id": "010819cc-dc4d-11e8-b152-0242ac130008",
                "job_type": "ingest_journal",
                "name": "JOB-ingest_journal-test.pdf"
                "state": "success",
                "task_ids": [
                    "9331a617-d35f-4b1a-be24-ec7a970c480e",
                    "f012ef11-1ac0-4810-986a-c31335b918fb",
                    "628abc60-2767-484a-a5c3-0b5a9c1a1ef6",
                    "c2a97fd1-28d2-4e97-b41f-67b6f70d91df",
                    "85cd98a7-fe3f-4e42-91f8-504c074be263",
                    "5af3a39c-f837-41df-8a5e-ecdc55a2bef6",
                    "2576d860-b694-4d41-8190-092f45837c37",
                    "8b7e956a-2fc1-446f-9cc8-9f1d63471b2a",
                    "d2d337a7-f346-4b7e-b1f8-4ee4942716f5",
                    "94304191-45fd-45f0-937c-02a6b13fb64c",
                    "b283d505-4174-4a46-909a-1f742dad6047",
                    "010819cc-dc4d-11e8-b152-0242ac130008"
                ],
                "updated": "Tue, 30 Oct 2018 14:06:59 GMT",
                "user": "test_user"
            },
            {
                "created": "Tue, 30 Oct 2018 14:07:04 GMT",
                "errors": [],
                "job_id": "147b74cc-dc4d-11e8-8db4-0242ac130008",
                "job_type": "ingest_journal",
                "name": "JOB-ingest_journal-test.pdf"
                "state": "success",
                "task_ids": [
                    "55614d2e-e442-46f8-8708-029c8e83c37f",
                    "92ef0e6e-f54c-4bd0-8079-08353d8ed3ea",
                    "e80224ec-e80f-456d-a02d-0d330f106454",
                    "feaa2a85-edc7-4d55-9a07-1940946445bb",
                    "c1c554d5-a37b-4342-80b3-a5cdecab652c",
                    "71c634ed-fe73-4e2e-8f60-ce92109c3dcd",
                    "bb073bbe-1489-495f-9bb2-80343a6f2160",
                    "fd393611-c344-4ed2-b090-ee8b95a337ec",
                    "7b8eceec-aab5-4edf-8a2b-d38981a07911",
                    "6a4f5fe6-6e25-4151-b114-548473f85f82",
                    "484f9623-2ae0-4969-b513-4f99dab1486e",
                    "147b74cc-dc4d-11e8-8db4-0242ac130008"
                ],
                "updated": "Tue, 30 Oct 2018 14:07:17 GMT",
                "user": "test_user"
            }
        ]

    :query show_all_jobs: (optional) if 'True', all jobs are listed
    :return: A JSON object containing the list of job objects
    """
    user = auth.username()
    jobs = job_db.get_jobs_for_user(user)
    show_all_jobs = request.args.get('show_all_jobs')
    response = []
    if not show_all_jobs or show_all_jobs == "false":
        threshold_days = int(os.environ['OLD_JOBS_THRESHOLD_DAYS'])
        threshold_date = (datetime.datetime.now() -
                          datetime.timedelta(days=threshold_days))
        for job in jobs:
            if job['updated'] > threshold_date:
                response.append(job)
    else:
        response = jobs
    return jsonify(response)


@job_controller.route('/ingest_journal', methods=['POST'])
@auth.login_required
def journal_job_create():
    """
        Create a journal batch import job.

        Parameters can be provided as JSON as part of the request body
        and must match the job parameter schema.

        Valid user credential have to be given via HTTP basic authentication.

        Also adds the job to the job database.

        .. :quickref: Job Controller; Create a job of the specified job type

        **Example request**:

        .. sourcecode:: http

          POST /job/<job-type> HTTP/1.1

          {
              "objects": [{
                   "id": "some_tiffs",
                   "path": "some_tiffs",
                   "metadata": {
                       "description": "Archäologischer Anzeiger",
                       "number": 1,
                       "ojs_journal_code": "test",
                       "volume": 1,
                       "year": 2015,
                       "zenon_id": 1449024
                    }
                },{
                    "id": "some_tiffs_2",
                    "path": "some_tiffs_2",
                    "metadata": {
                        "description": "Archäologischer Anzeiger",
                        "number": 2,
                        "ojs_journal_code": "test",
                        "volume": 2,
                        "year": 2016,
                        zenon_id": 1449024
                    }
                }],
                "options": {
                    "ojs_metadata": {
                        "auto_publish_issue": true,
                        "default_create_frontpage": true,
                        "allow_upload_without_file": false
                    }
                }
            }

        Each path ("some_tiffs" and "some_tiffs_2" in the example case, are expected to contain a directory "tif" that contains tif images.) 


        **Example response SUCCESS**:

        .. sourcecode:: http

            HTTP/1.1 200 OK

            {
                "job_id": "6abf2068-ea88-11e9-9d31-0242ac12000a",
                "status": "Accepted",
                "success": true,
                "task_ids": [
                    [
                        "6ac4447e-ea88-11e9-b5fd-0242ac12000a",
                        "6ac44e3e-ea88-11e9-8cec-0242ac12000a",
                        "6ac454b0-ea88-11e9-a491-0242ac12000a",
                        "6ac45942-ea88-11e9-8429-0242ac12000a",
                        "6ac45dae-ea88-11e9-a17b-0242ac12000a",
                        "6ac462a6-ea88-11e9-8706-0242ac12000a",
                        "6ac46750-ea88-11e9-b93a-0242ac12000a",
                        "6ac46e18-ea88-11e9-82ad-0242ac12000a",
                        "6ac47198-ea88-11e9-a826-0242ac12000a",
                        "6ac47646-ea88-11e9-b820-0242ac12000a",
                        "6ac47d58-ea88-11e9-b802-0242ac12000a",
                        "6ac48342-ea88-11e9-aa77-0242ac12000a"
                    ],
                    [
                        "6ac49174-ea88-11e9-9f30-0242ac12000a",
                        "6ac498c2-ea88-11e9-b61f-0242ac12000a",
                        "6ac49e4a-ea88-11e9-a941-0242ac12000a",
                        "6ac4a308-ea88-11e9-96ec-0242ac12000a",
                        "6ac4a7f6-ea88-11e9-889e-0242ac12000a",
                        "6ac4ab50-ea88-11e9-bcdd-0242ac12000a",
                        "6ac4b070-ea88-11e9-bee2-0242ac12000a",
                        "6ac4b6b8-ea88-11e9-b01b-0242ac12000a",
                        "6ac4bbde-ea88-11e9-b964-0242ac12000a",
                        "6ac4bf78-ea88-11e9-9547-0242ac12000a",
                        "6ac4c190-ea88-11e9-8a13-0242ac12000a",
                        "6ac4c380-ea88-11e9-9542-0242ac12000a"
                    ]
                ]
            }

        **Example response ERROR**:

        .. sourcecode:: http

            HTTP/1.1 400 BAD REQUEST

            {
                "error": {
                    "code": "bad_request",
                    "message": "400 Bad Request: The browser (or proxy)
                                sent a request that this server could
                                not understand."
                },
                "success": false
            }

        :reqheader Accept: application/json
        :param str job_type: name of the job type
        :<json dict objects: issue file path and metadata
        :<json dict options: job chain options

        :resheader Content-Type: application/json
        :>json dict: operation result
        :status 200: OK

        :return: A JSON object containing the status, the job id and the task
            ids of every subtask in every chain
    """

    if not request.data:
        raise ApiError("invalid_job_params", "No request payload found")
    params = request.get_json(force=True)
    user = auth.username()
    try:
        json_validation.validate_params(params, 'ingest_journal')
    except FileNotFoundError as e:
        raise ApiError("unknown_job_type", str(e), 404)
    except jsonschema.exceptions.ValidationError as e:
        raise ApiError("invalid_job_params", str(e), 400)

    user_param = {'user': user}
    chains = []

    for issue_object in params['objects']:
        task_params = dict(**issue_object, **user_param,
                           initial_representation='tif')

        current_chain = t('create_object', **task_params)

        current_chain |= t('list_files',
                           representation='tif',
                           target='pdf',
                           task='convert.tif_to_pdf')

        current_chain |= t('convert.merge_converted_pdf')

        current_chain |= t('list_files',
                           representation='tif',
                           target='jpg',
                           task='convert.tif_to_jpg')

        current_chain |= t('list_files',
                           representation='tif',
                           target='jpg_thumbnails',
                           task='convert.scale_image',
                           max_width=50,
                           max_height=50)

        current_chain |= t('generate_xml',
                           template_file='ojs3_template_issue.xml',
                           target_filename='ojs_import.xml',
                           ojs_metadata=params['options']['ojs_metadata'])

        current_chain |= t('generate_xml',
                           template_file='mets_template_no_articles.xml',
                           target_filename='mets.xml',
                           schema_file='mets.xsd')

        if params['options']['ojs_metadata']['auto_publish_issue']:
            current_chain |= t('publish_to_ojs',
                            ojs_metadata=params['options']['ojs_metadata'],
                            ojs_journal_code=issue_object['metadata']['ojs_journal_code'])
        current_chain |= t('publish_to_repository')
        current_chain |= t('publish_to_archive')
        current_chain |= t('cleanup_workdir')
        current_chain |= t('finish_chain')
        chains.append(current_chain)

    job = Job(user, 'ingest_journal', chains, params)
    job.run()

    body = jsonify({
        'success': True,
        'status': 'Accepted',
        'job_id': job.id
    })

    headers = {'Location': url_for(
        'job.job_status', job_id=job.id)}

    return body, 202, headers


@job_controller.route('/ingest_book', methods=['POST'])
@auth.login_required
def book_job_create():
    if not request.data:
        raise ApiError("invalid_job_params", "No request payload found")
    params = request.get_json(force=True)
    user = auth.username()

    try:
        json_validation.validate_params(params, 'ingest_book')
    except FileNotFoundError as e:
        raise ApiError("unknown_job_type", str(e), 404)
    except jsonschema.exceptions.ValidationError as e:
        raise ApiError("invalid_job_params", str(e), 400)

    user_param = {'user': user}
    chains = []

    for book_object in params['objects']:
        task_params = dict(**book_object, **user_param,
                           initial_representation='tif')

        current_chain = t('create_object', **task_params)

        current_chain |= t('list_files',
                           representation='tif',
                           target='jpg',
                           task='convert.tif_to_jpg')

        current_chain |= t('list_files',
                           representation='jpg',
                           target='jpg_thumbnails',
                           task='convert.tif_to_jpg',
                           max_width=50,
                           max_height=50)

        current_chain |= t('list_files',
                           representation='tif',
                           target='ptif',
                           task='convert.tif_to_ptif')

        current_chain |= t('list_files',
                           representation='tif',
                           target='pdf',
                           task='convert.tif_to_pdf')
        current_chain |= t('convert.merge_converted_pdf')

        if params['options']['do_ocr']:
            current_chain |= t('list_files',
                               representation='tif',
                               target='txt',
                               task='convert.tif_to_txt',
                               ocr_lang=params['options']['ocr_lang'])

        current_chain |= t('generate_xml',
                           template_file='mets_template_no_articles.xml',
                           target_filename='mets.xml',
                           schema_file='mets.xsd')

        current_chain |= t('publish_to_repository')
        current_chain |= t('publish_to_archive')

        current_chain |= t('cleanup_workdir')
        current_chain |= t('finish_chain')

        chains.append(current_chain)

    job = Job(user, 'ingest_book', chains, params)
    job.run()

    body = jsonify({
        'success': True,
        'status': 'Accepted',
        'job_id': job.id
    })

    headers = {'Location': url_for(
        'job.job_status', job_id=job.id)}
    return body, 202, headers


@job_controller.route('/param_schema/<job_type>', methods=['GET'])
def get_job_param_schema(job_type):
    """
    Serve the contents of the JSON parameter schema for the given job type.

    .. :quickref: Job Controller; Contents of the job param schema file

    **Example request**:

    .. sourcecode:: http

      GET /job/<job_type> HTTP/1.1

    **Example response**:

    .. sourcecode:: http

        HTTP/1.1 200 OK

        {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "additionalProperties": false,
            "description": "Used to validate ingest-journal job parameters",
            "properties": {
                "objects": {
                    "items": {
                        "properties": {
                            "path": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "path"
                        ],
                        "type": "object"
                    },
                    "type": "array"
                },
                "options": {
                    "additionalProperties": false,
                    "properties": {
                        "do_nlp": {
                            "type": "boolean"
                        },
                        "do_ocr": {
                            "type": "boolean"
                        },
                        "nlp_params": {
                            "additionalProperties": false,
                            "properties": {
                                "lang": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "lang"
                            ],
                            "type": "object"
                        },
                        "ocr_lang": {
                            "type": "string"
                        },
                        "ojs_metadata": {
                            "additionalProperties": false,
                            "properties": {
                                "allow_upload_without_file": {
                                    "type": "boolean"
                                },
                                "auto_publish_issue": {
                                    "type": "boolean"
                                },
                                "default_create_frontpage": {
                                    "type": "boolean"
                                },
                                "ojs_journal_code": {
                                    "type": "string"
                                },
                                "ojs_user": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "ojs_journal_code",
                                "ojs_user",
                                "auto_publish_issue",
                                "default_create_frontpage",
                                "allow_upload_without_file"
                            ],
                            "type": "object"
                        }
                    },
                    "required": [
                        "ojs_metadata",
                        "do_ocr",
                        "nlp_params"
                    ],
                    "type": "object"
                }
            },
            "required": [
                "objects",
                "options"
            ],
            "title": "Ingest Journal schema",
            "type": "object"
        }

    :reqheader Accept: application/json
    :param str job_type: Name of the job type

    :resheader Content-Type: application/json
    :>json dict: operation result
    :status 200: OK

    :return: JSON file content of the job parameter schema
    """
    try:
        schema = json_validation.get_schema(job_type)
        return jsonify(schema)
    except FileNotFoundError:
        raise ApiError(
            "job_type_not_found",
            f"No definition for given job type '{job_type}' found",
            404)


@job_controller.route('/<job_id>', methods=['GET'])
def job_status(job_id):
    """
    Return the status information for a job.

    Also looks up the job  in the job database to get the name.

    This function is also used to get task status. Those cannot be found in the
    job database (as it only holds job info) and no further info will be
    returned.

    .. :quickref: Job Controller; Status information for a job

    **Example request**:

    .. sourcecode:: http

      GET /job/<job-id> HTTP/1.1

    **Example response**:

    .. sourcecode:: http

        HTTP/1.1 200 OK

        {
            "result": {
                "object_id": "issue-test-1"
            },
            "status": "SUCCESS",
            "type": "ingest_book"
        }

    :reqheader Accept: application/json
    :param str job_id: Job ID

    :resheader Content-Type: application/json
    :>json dict: operation result
    :status 200: OK

    :return: A JSON object containing the status info
    """

    job = job_db.get_job_by_id(job_id)

    job['duration'] = str(datetime.timedelta(
        seconds=int((job['updated'] - job['created']).total_seconds())))
    return jsonify(job)


def t(name, **params):
    return celery_app.signature(name, kwargs=params)
