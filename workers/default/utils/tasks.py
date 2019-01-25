import os
import re
import shutil

from celery import group

from utils.celery_client import celery_app
from utils import job_db
from service.job.job_config import generate_chain
from workers.base_task import BaseTask, ObjectTask, ExceptionHandlingException


def _list_files_by_pattern(rep_path, pattern):
    regex = re.compile(pattern)
    files = []
    for f in _recursive_file_list(rep_path):
        if regex.search(os.path.basename(f)):
            files.append(f)
    return files


class ListFilesTask(ObjectTask):
    """
    Run a task list for every file in a given representation.

    A chain is created for every file. These are run in parellel. The next task
    is run when the last file chain has finished.

    TaskParams:
    -str representation: The name of the representation
    -list subtasks: list of tasks to be run
    -str pattern: Regex string to filter the files

    Preconditions:

    Creates:

    """

    name = "list_files"

    def process_object(self, obj):
        rep = self.get_param('representation')
        subtasks = self.get_param('subtasks')
        pattern = self.get_param('pattern')
        rep_path = obj.get_representation_dir(rep)
        files = _list_files_by_pattern(rep_path, pattern)
        raise self.replace(self._generate_group_for_files(files, subtasks))

    def _generate_group_for_files(self, files, subtasks):
        group_tasks = []
        for file in files:
            params = self.params.copy()
            params['job_id'] = self.job_id
            params['work_path'] = file
            # workaround for storing results inside params
            # this is necessary since prev_results do not always seem to be
            # passed to subtasks correctly by celery
            params['result'] = self.results
            chain = generate_chain(subtasks, params)
            group_tasks.append(chain)
        return group(group_tasks)


ForeachTask = celery_app.register_task(ListFilesTask())


class ListPartsTask(ObjectTask):
    """
    Run a task list for every part of the current object.

    A chain is created for every suboject. These are run in parallel. The next
    task is run when the last part chain has finished.

    TaskParams:
    -list subtasks: list of tasks to be run

    Preconditions:

    Creates:

    """

    name = "list_parts"

    def process_object(self, obj):
        subtasks = self.get_param('subtasks')
        raise self.replace(self._generate_group_for_parts(obj, subtasks))

    def _generate_group_for_parts(self, obj, subtasks):
        group_tasks = []
        for part in obj.get_parts():
            params = self.params.copy()
            params['work_path'] = part.path
            # workaround for storing results inside params
            # this is necessary since prev_results do not always seem to be
            # passed to subtasks correctly by celery
            params['result'] = self.results
            chain = generate_chain(subtasks, params)
            group_tasks.append(chain)
        return group(group_tasks)


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


class FinishJobTask(BaseTask):
    """Task to set the job state to success after all other tasks have run."""

    name = "finish_job"

    def execute_task(self):
        job_db.update_job(self.job_id, 'success')


FinishJobTask = celery_app.register_task(FinishJobTask())


class HandleErrorTask(BaseTask):
    """
    Task to handle any errors thrown in other tasks.

    It sets the failed job status in the job database and stops execution of
    any further tasks.
    """

    name = "handle_error"

    def execute_task(self):
        try:
            error = {
                'task_name': self.params['task_name'],
                'message': self.params['error_message']
                }
            job_db.update_job(self.job_id, 'failed', error)
            self.stop_chain_execution()
        except:  # noqa: bare exception is OK here, because any unhandled
                # Exception would cause an endless loop
            raise ExceptionHandlingException()


HandleErrorTask = celery_app.register_task(HandleErrorTask())


def _recursive_file_list(directory):
    for dirpath, _, filenames in os.walk(directory):
        for f in filenames:
            yield os.path.abspath(os.path.join(dirpath, f))
