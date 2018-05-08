import glob
import os
import shutil

from celery import signature, group

from utils.celery_client import celery_app

repository_dir = os.environ['REPOSITORY_DIR']
working_dir = os.environ['WORKING_DIR']


@celery_app.task(bind=True, name="match")
def match(self, object_id, job_id, prev_task, run, pattern='*.tif'):
    source = os.path.join(working_dir, job_id, object_id, prev_task)
    target = os.path.join(working_dir, job_id, object_id, self.name)
    os.makedirs(target)
    subtasks = []
    for file in glob.iglob(os.path.join(source, pattern)):
        subtasks.append(signature(
            run, [object_id, job_id, prev_task, self.name, file]
        ))
    raise self.replace(group(subtasks))


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
