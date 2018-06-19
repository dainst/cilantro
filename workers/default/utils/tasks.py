import os
import re
import shutil

from celery import group

from utils.celery_client import celery_app
from service.job.job_config import generate_chain
from workers.base_task import BaseTask


class ForeachTask(BaseTask):

    name = "foreach"

    def execute_task(self):
        pattern = self.get_param('pattern')
        subtasks = self.get_param('subtasks')
        work_path = self.get_work_path()
        group_tasks = []
        regex = re.compile(pattern)
        files = [f for f in os.listdir(work_path) if regex.search(f)]
        for file in files:
            params = {
                'job_id': self.job_id,
                'file': os.path.join(work_path, file)
            }
            chain = generate_chain(subtasks, params)
            group_tasks.append(chain)
        raise self.replace(group(group_tasks))


ForeachTask = celery_app.register_task(ForeachTask())


class CleanupWorkdirTask(BaseTask):

    name = "cleanup_workdir"

    def execute_task(self):
        work_path = self.get_work_path()
        shutil.rmtree(work_path)


CleanupWorkdirTask = celery_app.register_task(CleanupWorkdirTask())
