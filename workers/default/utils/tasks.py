import shutil
import os
import uuid
import glob

from celery import group

from utils.celery_client import celery_app
from utils import job_db
from workers.base_task import BaseTask, ObjectTask


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

    # TODO: use chord instead of group for callback after subtasks finish
    def _generate_group_for_files(self, files, subtasks):
        group_tasks = []
        child_ids = []
        for file in files:
            params = self.params.copy()
            params['job_id'] = str(uuid.uuid1())
            params['work_path'] = file
            params['parent_job_id'] = self.job_id
            # workaround for storing results inside params
            # this is necessary since prev_results do not always seem to be
            # passed to subtasks correctly by celery
            params['result'] = self.results
            chain = celery_app.signature(subtasks, kwargs=params)
            chain.options['task_id'] = params['job_id']

            child_ids += [params['job_id']]

            job_db.add_job(job_id=params['job_id'], user=None, job_type=subtasks,
                           parent_job_id=params['parent_job_id'], child_job_ids=[], parameters=params)

            group_tasks.append(chain)

        job_db.set_job_children(self.job_id, child_ids)
        job_db.update_job_state(self.job_id, "replaced")
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
        job_db.update_job_state(self.parent_job_id, 'success')


FinishChainTask = celery_app.register_task(FinishChainTask())


class FinishChordTask(BaseTask):
    """
    Finish a celery chord task, writes state into the mongo DB.
    """
    name = "finish_chord"

    def execute_task(self):
        job_db.update_job_state(self.job_id, "success")


FinishChordTask = celery_app.register_task(FinishChordTask())


class FailChordTask(BaseTask):
    name = "fail_chord"

    def execute_task(self):
        job_db.update_job_state(self.job_id, "FAILURE")
