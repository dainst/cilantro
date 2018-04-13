import os
import shutil

from utils.celery_client import celery

repository_dir = os.environ['REPOSITORY_DIR']
working_dir = os.environ['WORKING_DIR']


@celery.task(name="tasks.publish")
def publish(object_id, prev_task):
    source = os.path.join(working_dir, object_id, prev_task)
    target = os.path.join(repository_dir, object_id, 'publish')
    if os.path.exists(target):
        shutil.rmtree(target)
    shutil.copytree(source, target)