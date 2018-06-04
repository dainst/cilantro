from flask import Blueprint, url_for, jsonify, request, g
from utils.celery_client import celery_app
from service.job.job_config import JobConfig
import logging


def get_job_config():
    job_config = getattr(g, '_job_config', None)
    if job_config is None:
        job_config = g._job_config = JobConfig()
    return job_config


job_controller = Blueprint('job', __name__)


@job_controller.route('/<job_type>/<object_id>', methods=['POST'])
def job_create(job_type, object_id):
    params = request.get_json(force=True, silent=True)
    job = get_job_config().generate_job(job_type, object_id, params)
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
    task = celery_app.AsyncResult(job_id)
    response = {
        'status': task.state
    }
    if hasattr(task.info, 'result'):
        response['result'] = task.info['result']
    return jsonify(response)


def _get_task_ids(task):
    task_ids = [task.id]
    while task.parent is not None:
        task_ids.insert(0, task.parent.id)
        task = task.parent
    return task_ids
