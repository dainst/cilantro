import shutil

from utils.celery_client import celery_app
from utils import job_db
from workers.base_task import BaseTask, ExceptionHandlingException


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
