import os
import logging

from flask import Blueprint, url_for, jsonify, request, g

from utils.celery_client import celery_app
from service.job.job_config import JobConfig


config_dir = os.environ['CONFIG_DIR']


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
def job_create(job_type):
    """
    Creates a job of the specified job type.

    A task chain is constructed as defined in the corresponding job type
    definition YAML file and executed.

    Parameters can be provided as JSON objects as part of the request body
    and must match the parameters defined in the corresponding job config YAML.

    :param str job_type:
    :return: A JSON object containing the status, the job id and the task ids
        of every subtask in the chain
    """
    params = request.get_json(force=True, silent=True)
    job = get_job_config().generate_job(job_type, params)
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
    Returns the status information for a job.

    :param str job_id:
    :return: A JSON object containing the status (e.g. "{ 'status': 'PENDING' }"
    """
    task = celery_app.AsyncResult(job_id)
    response = {
        'status': task.state
    }
    if hasattr(task.info, 'result'):
        response['result'] = task.info['result']
    return jsonify(response)


@job_controller.route('/jobtypes', methods=['GET'])
def get_job_types():
    """
    Returns a list of available job types. Job types are taken from the
    config directory.

    :return str: JSON list containing the type names
    """
    return jsonify(os.listdir(config_dir))


def _get_task_ids(task):
    task_ids = [task.id]
    while task.parent is not None:
        task_ids.insert(0, task.parent.id)
        task = task.parent
    return task_ids
