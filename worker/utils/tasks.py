import glob
import os
import shutil
from service.job.job_config import generate_chain
from celery import group

from worker.tasks import BaseTask
from utils.celery_client import celery_app


class ForeachTask(BaseTask):

    name = "foreach"

    def execute_task(self):
        pattern = self.get_param('pattern')
        subtasks = self.get_param('subtasks')
        work_path = self.get_work_path(self.job_id)
        group_tasks = []
        for file in glob.iglob(os.path.join(work_path, pattern)):
            params = {
                'job_id': self.job_id,
                'file': file
            }
            chain = generate_chain(self.object_id, subtasks, params)
            group_tasks.append(chain)
        raise self.replace(group(group_tasks))


ForeachTask = celery_app.register_task(ForeachTask())


class CleanupWorkdirTask(BaseTask):

    name = "cleanup_workdir"

    def execute_task(self):
        work_path = self.get_work_path(self.job_id)
        shutil.rmtree(work_path)


CleanupWorkdirTask = celery_app.register_task(CleanupWorkdirTask())
