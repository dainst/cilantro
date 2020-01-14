import shutil
import os
import uuid
import glob

from celery import chord, signature

from utils.celery_client import celery_app
from workers.base_task import BaseTask, ObjectTask


class ListFilesTask(ObjectTask):
    """
    Run a task list for every file in a given representation.

    A chain is created for every file. These are run in parallel. The next task
    is run when the last file chain has finished.

    TaskParams:
    -str representation: The name of the representation
    -list task: the name of the task that is run for all files
    """

    name = "list_files"
    label = "File batch"
    description = "Group containing individual steps applied to individual files."

    def process_object(self, obj):
        rep = self.get_param('representation')
        task = self.get_param('task')

        pattern = os.path.join(obj.get_representation_dir(rep), '*.*')
        files = []
        for matching_file in glob.iglob(pattern):
            files.append(matching_file)
        raise self.replace(self._generate_chord_for_files(files, task))

    def _generate_chord_for_files(self, files, subtasks):
        chord_tasks = []
        child_ids = []
        for file in files:
            chain, task_id = self._create_chain(file, subtasks)
            child_ids += [task_id]
            chord_tasks.append(chain)

        self.job_db.set_job_children(self.job_id, child_ids)
        self.job_db.update_job_state(self.job_id, "started")

        return chord(chord_tasks, signature('finish_chord', kwargs={'job_id': self.job_id, 'work_path': self.job_id}))

    def _create_chain(self, file, subtasks):
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

        self.job_db.add_job(job_id=params['job_id'], user=None, job_type=subtasks,
                       parent_job_id=params['parent_job_id'], child_job_ids=[], parameters=params)

        return chain, params['job_id']


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
    label = "Cleanup"
    description = "Cleans up the internal working directory."

    def execute_task(self):
        work_path = self.get_work_path()
        shutil.rmtree(work_path)


CleanupWorkdirTask = celery_app.register_task(CleanupWorkdirTask())


class FinishChainTask(BaseTask):
    """Task to set the job state to success after all other tasks have run."""

    name = "finish_chain"
    label = "Finish batch"
    description = ""

    def execute_task(self):
        self.job_db.update_job_state(self.parent_job_id, 'success')


FinishChainTask = celery_app.register_task(FinishChainTask())


class FinishChordTask(BaseTask):
    """
    Finish a celery chord task, writes state into the mongo DB.
    """
    name = "finish_chord"
    label = "No label set for chord task"
    description = "No label set for chord task"

    def _init_params(self, params):
        """
        The original chord task gets replaced by celery by this callback task. We initialized
        the original task in the job database with a given name (see jobs.py). Replacing the original
        task will also set the label and description to the default values as defined in base_task.py.
        For that reason, we read the initial values from the job database, set them as label/description
        for the replacing task und then initialize the parameters.
        """

        intial_job = self.job_db.get_job_by_id(params['job_id'])
        self.label = intial_job['label']
        self.description = intial_job['description']

        super()._init_params(params)

    def execute_task(self):
        self.job_db.update_job_state(self.job_id, "success")


FinishChordTask = celery_app.register_task(FinishChordTask())
