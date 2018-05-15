import glob
import os
import shutil
from service.job.job_config import generate_chain
from celery import group
from utils.celery_client import celery_app

repository_dir = os.environ['REPOSITORY_DIR']
working_dir = os.environ['WORKING_DIR']


@celery_app.task(bind=True, name="foreach")
def foreach(self, object_id, job_id, prev_task, subtasks, pattern='*.tif'):
    source = os.path.join(working_dir, job_id, object_id, prev_task)
    target = os.path.join(working_dir, job_id, object_id, self.name)
    os.makedirs(target)
    group_tasks = []
    for file in glob.iglob(os.path.join(source, pattern)):
        params = {
            'job_id': job_id,
            'parent_task': self.name,
            'file': file,
            'prev_task': prev_task
        }
        group_tasks.append(generate_chain(object_id, subtasks, params))
    raise self.replace(group(group_tasks))


@celery_app.task(name="rename")
def rename(object_id, job_id, prev_task, parent_task, file):
    source = os.path.join(working_dir, job_id, object_id, prev_task)
    target = os.path.join(working_dir, job_id, object_id, parent_task)
    new_file = file.replace('.tif', '.jpg').replace(source, target)
    shutil.copyfile(file, new_file)


@celery_app.task(name="cleanup_workdir")
def cleanup_workdir(object_id, job_id, prev_task):
    folder = os.path.join(working_dir, job_id)
    shutil.rmtree(folder)
