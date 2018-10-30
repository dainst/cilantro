import logging

from flask import Blueprint, url_for, jsonify, request, g

from service.errors import ApiError
from utils.celery_client import celery_app
from service.job.job_config import JobConfig, UnknownJobTypeException, \
    RequestParameterException
from service.user.user_service import auth
from utils import job_db


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
    List all jobs of the user.

    :return: A JSON object containing the list of job objects
    """
    user = auth.username()
    return jsonify(job_db.get_jobs_for_user(user))


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

    :param str job_type:
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

    job_db.add_job(job_id, user, job_type, task_ids)

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

    :param str job_id:
    :return: A JSON object containing the status"
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
