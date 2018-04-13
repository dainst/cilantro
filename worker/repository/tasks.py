import os
import shutil

from utils.celery_client import celery

repository_dir = os.environ['REPOSITORY_DIR']
working_dir = os.environ['WORKING_DIR']


@celery.task(name="tasks.retrieve")
def retrieve(object_id):
    if not os.path.exists(repository_dir):
        os.makedirs(repository_dir)
    if not os.path.exists(working_dir):
        os.makedirs(working_dir)
    source = os.path.join(repository_dir, object_id, 'upload')
    target = os.path.join(working_dir, object_id, 'retrieve')
    if os.path.exists(target):
        shutil.rmtree(target)
    shutil.copytree(source, target)


@celery.task(name="tasks.publish")
def publish(object_id, prev_task):
    source = os.path.join(working_dir, object_id, prev_task)
    target = os.path.join(repository_dir, object_id, 'publish')
    if os.path.exists(target):
        shutil.rmtree(target)
    shutil.copytree(source, target)