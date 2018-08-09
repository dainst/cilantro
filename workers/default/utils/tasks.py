import os
import re
import shutil

from celery import group

from utils.celery_client import celery_app
from service.job.job_config import generate_chain
from workers.base_task import BaseTask


class ForeachTask(BaseTask):
    """
    Run a task list for every file of a given pattern.

    TaskParams:
    -str pattern: Regex string to find the files.
    -list subtasks: list of tasks to be run.

    Preconditions:

    Creates:

    """
    name = "foreach"

    def execute_task(self):
        pattern = self.get_param('pattern')
        subtasks = self.get_param('subtasks')
        work_path = self.get_work_path()
        group_tasks = []
        regex = re.compile(pattern)
        files = []

        for f in _recursive_file_list(work_path):
            if regex.search(f):
                files.append(f)

        for file in files:
            params = self.params.copy()
            params['job_id'] = self.job_id
            params['file'] = os.path.join(work_path, file)

            chain = generate_chain(subtasks, params)
            group_tasks.append(chain)
        raise self.replace(group(group_tasks))


ForeachTask = celery_app.register_task(ForeachTask())


class IfTask(BaseTask):
    """
    Run a task list if a condition is met and optionally another one if not.

    TaskParams:
    -boolean condition: Condition to be checked upon
    -TaskList do:
    -TaskList else:

    Preconditions:

    Creates:

    """
    name = "if"

    def execute_task(self):
        condition = self.get_param('condition')
        do = self.get_param('do')
        group_tasks = []
        params = self.params.copy()
        if eval(condition):
            chain = generate_chain(do, params)
        elif 'else' in self.params:
            chain = generate_chain(self.get_param('else'), params)
        group_tasks.append(chain)

        raise self.replace(group(group_tasks))


IfTask = celery_app.register_task(IfTask())


class CleanupWorkdirTask(BaseTask):
    """
    Remove the complete content of the working dir.

    TaskParams:

    Preconditions:

    Creates:
    -Empty working dir
    """

    name = "cleanup_workdir"

    def execute_task(self):
        work_path = self.get_work_path()
        shutil.rmtree(work_path)


CleanupWorkdirTask = celery_app.register_task(CleanupWorkdirTask())


def _recursive_file_list(directory):
    for dirpath, _, filenames in os.walk(directory):
        for f in filenames:
            yield os.path.abspath(os.path.join(dirpath, f))
