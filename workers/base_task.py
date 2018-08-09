import logging
import os
from abc import abstractmethod

import celery.signals
from celery.task import Task

from utils.setup_logging import setup_logging


setup_logging()


@celery.signals.setup_logging.connect
def on_celery_setup_logging(**_):
    # underscore is a throwaway-variable, to avoid code style warning for
    # unused variable
    """
    Enable manual logging configuration, independent of celery.
    """
    pass


def merge_dicts(a, b, path=None):
    """
    Deep merge two dictionaries.

    The two dictionaries are merged recursively so that values
    that are themselves dictionaries are merged as well.

    :param dict a:
    :param dict b:
    :param str path:
    :return dict:
    """
    if path is None:
        path = []
    for key in b:
        if key in a:
            if isinstance(a[key], dict) and isinstance(b[key], dict):
                merge_dicts(a[key], b[key], path + [str(key)])
            elif a[key] == b[key]:
                pass  # same leaf value
            else:
                raise Exception('Conflict at %s' % '.'.join(path + [str(key)]))
        else:
            a[key] = b[key]
    return a


class BaseTask(Task):
    """
    Abstract base class for all tasks in cilantro.

    It provides parameter handling and utility methods for accessing
    the file system.

    Implementations should override the execute_task() method.

    Return values of execute_task() are saved under the 'result' key in the
    params dictionary. This allows reading task results at a later stage,
    i.e. in a following task or when querying the job status.
    """

    working_dir = os.environ['WORKING_DIR']
    params = {}
    job_id = None
    log = logging.getLogger(__name__)

    def get_work_path(self):
        work_path = os.path.join(self.working_dir, self.job_id)
        if not os.path.exists(work_path):
            os.mkdir(work_path)
        return work_path

    def run(self, prev_result=None, **params):
        self._init_params(params)
        if isinstance(prev_result, list):
            for result in prev_result:
                self.params['result'] = self._add_result_to_params(result)
        else:
            self.params['result'] = self._add_result_to_params(prev_result)
        result = self.execute_task()
        if result:
            return self._add_result_to_params(result)
        else:
            return self.params['result']

    def get_param(self, key):
        try:
            return self.params[key]
        except KeyError:
            raise KeyError(f"Mandatory parameter {key} is missing"
                           f" for {self.__class__.__name__}")

    @abstractmethod
    def execute_task(self):
        """
        Execute the task.

        This method has to be implemented by all subclassed tasks and includes
        the actual implementation logic of the specific task.

        Results have to be dicts and are merged recursively so that partial
        results in task chains accumulate and may be extended or modified
        by following tasks.

        :return dict:
        """
        raise NotImplementedError("Execute Task method not implemented")

    def _add_result_to_params(self, result):
        if isinstance(result, dict):
            return merge_dicts(self.params['result'], result)
        elif result:
            raise KeyError(f"Wrong result type in previous task")
        else:
            return self.params['result']

    def _init_params(self, params):
        self.params = params
        try:
            self.job_id = params['job_id']
        except KeyError:
            raise KeyError("job_id has to be set before running a task")
        if 'result' not in self.params:
            self.params['result'] = {}
        self.log.debug(f"initialized params: {self.params}")
