import logging

from flask import Blueprint, url_for, jsonify, request, g

from service.errors import ApiError
from utils.celery_client import celery_app
from service.job.job_config import JobConfig, UnknownJobTypeException, \
    RequestParameterException
from service.user.user_service import auth


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

    .. :quickref: Job Controller; \
        Create a job of the specified job type.

    **Example request**:

    .. sourcecode:: http

      POST /job/<job-type> HTTP/1.1

        {
            "metadata": {
                "volume": "",
                "year": 2018,
                "number": "",
                "description": "[PDFs teilweise verf\u00fcgbar]",
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
                            "showndesc": "1\u201320",
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
                            "showndesc": "21\u201327",
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
                "lang": "de",
                "operations": [
                    "NER"
                ]
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


    **Example response**:

    .. sourcecode:: http

      HTTP/1.1 200 OK

      TODO

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
    params = {}
    if request.data:
        params = request.get_json(force=True)
    user = auth.username()
    try:
        job = get_job_config().generate_job(job_type, user, params)
    except UnknownJobTypeException as e:
        raise ApiError("unknown_job_type", str(e), 404)
    except RequestParameterException as e:
        raise ApiError("invalid_job_params", str(e))
    task = job.run()
    logger = logging.getLogger(__name__)
    logger.info(f"created job with id: {task.id}")

    job_id = task.id
    task_ids = _get_task_ids(task)

    body = jsonify({
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

    .. :quickref: Job Controller; \
        Return the status information for a job.

    **Example request**:

    .. sourcecode:: http

      GET /job/<job-id> HTTP/1.1

    **Example response**:

    .. sourcecode:: http

      HTTP/1.1 200 OK

      TODO

    :reqheader Accept: application/json
    :param str job_id: Job ID

    :resheader Content-Type: application/json
    :>json dict: operation result
    :status 200: OK

    :return: A JSON object containing the status (e.g. "{ 'status': 'PENDING' }"
    """
    task = celery_app.AsyncResult(job_id)
    response = {
        'status': task.state
    }
    if hasattr(task, 'result'):
        response['result'] = task.result
    return jsonify(response)


def _get_task_ids(task):
    task_ids = [task.id]
    while task.parent is not None:
        task_ids.insert(0, task.parent.id)
        task = task.parent
    return task_ids
