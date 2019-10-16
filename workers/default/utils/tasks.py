import shutil
import os
import glob

from celery import group

from utils.celery_client import celery_app
from utils import job_db
from workers.base_task import BaseTask, ObjectTask, ExceptionHandlingException


class ListFilesTask(ObjectTask):
    """
    Run a task list for every file in a given representation.

    A chain is created for every file. These are run in parellel. The next task
    is run when the last file chain has finished.

    TaskParams:
    -str representation: The name of the representation
    -list task: the name of the task that is run for all files
    """

    name = "list_files"

    def process_object(self, obj):
        rep = self.get_param('representation')
        task = self.get_param('task')

        pattern = os.path.join(obj.get_representation_dir(rep), '*.*')
        files = []
        for tif_file in glob.iglob(pattern):
            files.append(tif_file)
        raise self.replace(self._generate_group_for_files(files, task))

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

            chain = celery_app.signature(subtasks, kwargs=params)
            group_tasks.append(chain)
        return group(group_tasks)


ListFilesTask = celery_app.register_task(ListFilesTask())


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


class FinishChainTask(BaseTask):
    """Task to set the job state to success after all other tasks have run."""

    name = "finish_chain"

    def execute_task(self):
        job_db.update_job(self.parent_job_id, 'success')


FinishChainTask = celery_app.register_task(FinishChainTask())


class FinishChordTask(BaseTask):
    """
    Finish a celery chord task, writes state into the mongo DB.
    """
    name = "finish_chord"

    def execute_task(self):
        job_db.update_job(self.job_id, "success")

    def on_failure(self):
        job_db.update_job(self.job_id, "FAILURE")


FinishChordTask = celery_app.register_task(FinishChordTask())
