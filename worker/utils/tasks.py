import glob
import os
import shutil
from service.job.job_config import generate_chain
from celery import group

from worker.tasks import BaseTask
from utils.celery_client import celery_app


@celery_app.task(bind=True, name="foreach", base=BaseTask)
def foreach(self, object_id, job_id, subtasks, pattern='*.tif'):
    work_path = self.get_work_path(job_id)
    group_tasks = []
    for file in glob.iglob(os.path.join(work_path, pattern)):
        params = {
            'job_id': job_id,
            'file': file
        }
        group_tasks.append(generate_chain(object_id, subtasks, params))
    raise self.replace(group(group_tasks))


@celery_app.task(name="rename")
def rename(object_id, job_id, file):
    new_file = file.replace('.tif', '.jpg')
    shutil.copyfile(file, new_file)


@celery_app.task(bind=True, name="cleanup_workdir", base=BaseTask)
def cleanup_workdir(self, object_id, job_id):
    work_path = self.get_work_path(job_id)
    shutil.rmtree(work_path)
