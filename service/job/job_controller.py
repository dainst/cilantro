from flask import Blueprint, url_for, jsonify
from utils.celery_client import celery
from service.job.job_config import JobConfig

job = Blueprint('job', __name__)

job_config = JobConfig()
print("job types: %s" % job_config.job_types)


@job.route('/<job_type>/<object_id>', methods=['POST'])
def job_create(job_type, object_id):
    chain = job_config.generate_job(job_type, object_id)
    print("created chain: %s" % chain)
    task = chain.apply_async()
    print("created job with id: %s" % task.id)
    return jsonify({'status': 'Accepted', 'job_id': task.id}), \
           202, {'Location': url_for('job.job_status', job_id=task.id)}


@job.route('/<job_id>', methods=['GET'])
def job_status(job_id):
    task = celery.AsyncResult(job_id)
    response = {
        'status': task.state
    }
    if hasattr(task.info, 'result'):
        response['result'] = task.info['result']
    return jsonify(response)
