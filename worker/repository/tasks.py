import os
import shutil

from utils.celery_client import celery

repository_dir = os.environ['REPOSITORY_DIR']
working_dir = os.environ['WORKING_DIR']
staging_dir = os.environ['STAGING_DIR']


@celery.task(name="tasks.retrieve", bind=True)
def retrieve(self, object_id, job_id):
    if not os.path.exists(staging_dir):
        os.makedirs(staging_dir)
    if not os.path.exists(working_dir):
        os.makedirs(working_dir)
    source = os.path.join(staging_dir, object_id)
    target = os.path.join(working_dir, job_id, object_id, 'retrieve')
    if os.path.exists(target):
        shutil.rmtree(target)
    shutil.copytree(source, target)


@celery.task(name="tasks.publish")
def publish(object_id, job_id, prev_task):
    source = os.path.join(working_dir, job_id, object_id, prev_task)
    target = os.path.join(repository_dir, object_id)
    if os.path.exists(target):
        shutil.rmtree(target)
    shutil.copytree(source, target)
