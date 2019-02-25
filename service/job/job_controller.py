import logging
import jsonschema
import os
import datetime

from flask import Blueprint, url_for, jsonify, request, g

from service.errors import ApiError
from utils.celery_client import celery_app
from service.job.job_config import JobConfig
from service.user.user_service import auth
from utils import job_db
from utils import json_validation


def get_job_config():
    """
    Get the job config singleton or creates it if it does not exist already.

    :return JobConfig:
    """
    job_config = getattr(g, '_job_config', None)
    if job_config is None:
        job_config = g._job_config = JobConfig()
    return job_config


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
    if not show_all_jobs:
        threshold_days = int(os.environ['OLD_JOBS_THRESHOLD_DAYS'])
        threshold_date = (datetime.datetime.now() -
                          datetime.timedelta(days=threshold_days))
        for job in jobs:
            if job['updated'] > threshold_date or job['state'] != 'success':
                response.append(job)
    else:
        response = jobs
    return jsonify(response)


@job_controller.route('/<job_type>', methods=['POST'])
@auth.login_required
def job_create(job_type):
    """
    Create a job of the specified job type.

    A task chain is constructed as defined in the corresponding job type
    definition YAML file and executed.

    Parameters can be provided as JSON objects as part of the request body
    and must match the parameters defined in the corresponding job config YAML.

    Valid user credential have to be given via HTTP basic authentication.

    Also adds the job to the job database.

    .. :quickref: Job Controller; Create a job of the specified job type

    **Example request**:

    .. sourcecode:: http

      POST /job/<job-type> HTTP/1.1

        {
            "metadata": {
                "volume": "",
                "year": 2018,
                "number": "",
                "description": "[PDFs teilweise verfugbar]",
                "importFilePath": "test.pdf",
                "identification": "year"
            },
            "files": [{
                "file": "test.pdf",
                "range": [
                    1,
                    5
                ]
            }],
            "parts": [{
                    "metadata": {
                        "title": "Ein kleines Musterdokument",
                        "abstract": "Bachelorarbeit",
                        "author": [{
                            "firstname": "Erich ",
                            "lastname": "Mustermann"
                        }],
                        "pages": {
                            "showndesc": "101320",
                            "startPrint": 1,
                            "endPrint": 2
                        },
                        "date_published": "2018--",
                        "language": "de_DE",
                        "zenonId": "",
                        "auto_publish": true,
                        "create_frontpage": false
                    },
                    "files": [{
                        "file": "test.pdf",
                        "range": [
                            1,
                            2
                        ]
                    }]
                },
                {
                    "metadata": {
                        "title": "Titel 2",
                        "author": [{
                            "firstname": "Autor",
                            "lastname": "Dererste"
                        }],
                        "pages": {
                            "showndesc": "2101327",
                            "startPrint": 21,
                            "endPrint": 23
                        },
                        "date_published": "2018--",
                        "language": "de_DE",
                        "zenonId": "",
                        "auto_publish": true,
                        "create_frontpage": false
                    },
                    "files": [{
                        "file": "test.pdf",
                        "range": [
                            21,
                            23
                        ]
                    }]
                }
            ],
            "nlp_params": {
                "lang": "de"
            },
            "ojs_metadata": {
                "ojs_journal_code": "test",
                "ojs_user": "ojs_user",
                "auto_publish_issue": false,
                "default_publish_articles": true,
                "default_create_frontpage": true,
                "allow_upload_without_file": false
            },
            "do_ocr": false
        }


    **Example response SUCCESS**:

    .. sourcecode:: http

        HTTP/1.1 200 OK

        {
            "success": true,
            "job_id": "010819cc-dc4d-11e8-b152-0242ac130008",
            "status": "Accepted",
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
    :<json dict metadata: descriptive data of the issue/book
    :<json dict files: files containing the raw data
    :<json dict parts: metadata for sub-parts
    :<json dict nlp_params: NLP instructions
    :<json dict ojs_metadata: OJS specific metadata
    :<json string do_ocr: switch for OCR execution

    :resheader Content-Type: application/json
    :>json dict: operation result
    :status 200: OK

    :return: A JSON object containing the status, the job id and the task ids
        of every subtask in the chain
    """
    if not request.data:
        raise ApiError("invalid_job_params", "No request payload found")
    params = request.get_json(force=True)
    if not os.path.isfile(os.path.join(os.environ['CONFIG_DIR'],
                                       'job_types', job_type + '.yml')):
        raise ApiError("unknown_job_type", "No job definition file found", 404)
    try:
        json_validation.validate_params(params, job_type)
    except FileNotFoundError as e:
        raise ApiError("unknown_job_type", str(e), 404)
    except jsonschema.exceptions.ValidationError as e:
        raise ApiError("invalid_job_params", str(e), 400)
    user = auth.username()
    job = get_job_config().generate_job(job_type, user, params)
    task = job.run()
    logger = logging.getLogger(__name__)
    logger.info(f"created job with id: {task.id}")

    job_id = task.id
    task_ids = _get_task_ids(task)

    job_db.add_job(job_id, user, job_type, task_ids, params)

    body = jsonify({
        'success': True,
        'status': 'Accepted',
        'job_id': job_id,
        'task_ids': task_ids
        })
    headers = {'Location': url_for('job.job_status', job_id=task.id)}
    return body, 202, headers


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
    task = celery_app.AsyncResult(job_id)
    job = job_db.get_job_by_id(job_id)

    if not job:  # simple task, not a job
        job = {}
    else:
        if task.state == 'SUCCESS':
            end_time = job['updated']
        else:
            end_time = datetime.datetime.now()
        job['duration'] = str(datetime.timedelta(
            seconds=int((end_time - job['created']).total_seconds())))
    response = {
        'status': task.state,
        **job}
    if hasattr(task, 'result'):
        response['result'] = task.result
    return jsonify(response)


def _get_task_ids(task):
    task_ids = [task.id]
    while task.parent is not None:
        task_ids.insert(0, task.parent.id)
        task = task.parent
    return task_ids
