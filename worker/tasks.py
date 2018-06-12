import logging
import os

import celery.signals
from celery.task import Task
from abc import abstractmethod

from utils.setup_logging import setup_logging
from utils.celery_client import celery_app


setup_logging()


@celery.signals.setup_logging.connect
def on_celery_setup_logging(**_):  # underscore is a throwaway-variable, to avoid code style warning for unused variable
    """
    Enables manual logging configuration, independent of celery.
    """
    pass


class BaseTask(Task):
    """
    This is the abstract base class for all tasks in cilantro.
    It provides parameter handling and utility methods for accessing
    the file system.

    Implementations should override the execute_task() method.
    """

    working_dir = os.environ['WORKING_DIR']
    params = {}
    job_id = None
    object_id = None
    log = logging.getLogger(__name__)

    def get_work_path(self, job_id):
        return os.path.join(self.working_dir, job_id)

    def run(self, **params):
        self._init_params(params)
        self.execute_task()

    def get_param(self, key):
        try:
            return self.params[key]
        except KeyError:
            raise KeyError(f"Mandatory parameter {key} is missing"
                           f"for {self.__class__.__name__}")

    @abstractmethod
    def execute_task(self):
        """
        This method has to be implemented by all subclassed tasks and includes
        the actual implementation logic of the specific task.
        :return:
        """
        raise NotImplementedError("Execute Task method not implemented")

    def _init_params(self, params):
        self.params = params
        try:
            self.job_id = params['job_id']
        except KeyError:
            raise KeyError("job_id has to be set before running a task")

        try:
            self.object_id = params['object_id']
        except KeyError:
            raise KeyError("object_id has to be set before running a task")
        self.log.debug(f"initialized params: {self.params}")


celery_app.autodiscover_tasks([
    'worker.convert',
    'worker.pdf',
    'worker.repository',
    'worker.utils',
    'worker.xml'
], force=True)
