import os
import re
import shutil

from celery import group

from utils.object import Object
from utils.celery_client import celery_app
from service.job.job_config import generate_chain
from workers.base_task import BaseTask


class ForeachTask(BaseTask):
    """
    Run a task list for every file in a given representation.

    TaskParams:
    -str representation: The name of the representation
    -list subtasks: list of tasks to be run
    -str pattern: Regex string to filter the files

    Preconditions:

    Creates:

    """
    name = "foreach"

    def execute_task(self):
        rep = self.get_param('representation')
        subtasks = self.get_param('subtasks')
        pattern = self.get_param('pattern')
        rep_path = os.path.join(self.get_work_path(), Object.DATA_DIR, rep)
        group_tasks = []
        regex = re.compile(pattern)
        files = []

        for f in _recursive_file_list(rep_path):
            if regex.search(os.path.basename(f)):
                files.append(f)

        for file in files:
            params = self.params.copy()
            params['job_id'] = self.job_id
            params['file'] = file

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
        condition = self.get_param(self.get_param('condition'))
        do = self.get_param('do')
        params = self.params.copy()
        if condition:
            chain = generate_chain(do, params)
        elif 'else' in self.params:
            chain = generate_chain(self.get_param('else'), params)

        raise self.replace(chain)


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
