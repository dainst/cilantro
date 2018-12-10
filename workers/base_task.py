import logging
import os
from abc import abstractmethod
import traceback

import celery.signals
from celery.task import Task

from utils.object import Object
from utils.setup_logging import setup_logging
from utils.celery_client import celery_app


setup_logging()


class ExceptionHandlingException(Exception):
    """Exception to handle errors when handling Exceptions.

    This is to be thrown when an error occurs while handling another exception.
    This way a loop is avoided.
    """
    pass


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

    Entries in dict b override values in dict a.

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
            elif type(a) is type(b):
                a[key] = b[key]
            else:
                raise Exception('Conflicting types at %s'
                                % '.'.join(path + [str(key)]))
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
    results = {}
    work_path = None
    log = logging.getLogger(__name__)

    def stop_chain_execution(self):
        """
        Stop execution of all tasks in the chain.

        This is obviously for error cases. When an error is thrown and
        handled, the execution would continue in it erroneous state and
        throw even more errors.
        With this the task chain is emptied and execution stops.
        """
        self.request.chain = None
        self.request.chord = None

    def get_work_path(self):
        abs_path = os.path.join(self.working_dir, self.work_path)
        if not os.path.exists(abs_path):
            os.mkdir(abs_path)
        return abs_path

    def run(self, prev_result=None, **params):
        """
        Run the task logic and handle possible errors.

        In case the task throws an exception, it is caught and the task
        is replaced by a special task for handling exceptions.
        This task writes the error to the job database and sets the job status
        to 'failed'.

        Exceptions coming from the exception handler are just reraised
        and not handled further.

        Exceptions coming from celery because of ignored tasks are reraised
        and not handled further.

        :param dict/list prev_result: (optional) result of the previous task
        :return dict: merged result of the task and previous tasks
        """
        self.results = {}
        self._init_params(params)
        if prev_result:
            self._add_prev_result_to_results(prev_result)
        # results can also be part of the params array in some cases
        if 'result' in params:
            self._add_prev_result_to_results(params['result'])

        try:
            task_result = self.execute_task()
        except celery.exceptions.Ignore:
            # Celery-internal Exception thrown when tasks are ignored/replaced
            raise
        except ExceptionHandlingException:
            # Error when handling Exception of the task
            raise
        except Exception as e:  # noqa: ignore bare except
            self.log.error(traceback.format_exc())
            params = self.params.copy()
            params['job_id'] = self.job_id
            params['task_name'] = self.__name__
            params['error_message'] = str(e)
            kwargs = {}
            if params:
                kwargs.update(params)
            raise self.replace(celery_app.signature('handle_error',
                                                    kwargs=kwargs))
        return self._merge_result(task_result)

    def get_param(self, key):
        try:
            return self.params[key]
        except KeyError:
            raise KeyError(f"Mandatory parameter {key} is missing"
                           f" for {self.__class__.__name__}")

    def get_result(self, key):
        try:
            return self.results[key]
        except KeyError:
            raise KeyError(f"Mandatory result {key} is missing"
                           f" for {self.__class__.__name__}")

    @abstractmethod
    def execute_task(self):
        """
        Execute the task.

        This method has to be implemented by all subclassed tasks and includes
        the actual implementation logic of the specific task.

        Results have to be dicts or lists of results and are merged recursively
        so that partial results in task chains accumulate and may be extended
        or modified by following tasks.

        Tasks do not have to return results, i.e. the result may be None.

        :return dict:
        """
        raise NotImplementedError("Execute Task method not implemented")

    def _add_prev_result_to_results(self, prev_result):
        if isinstance(prev_result, dict):
            self.results = merge_dicts(self.results, prev_result)
        elif isinstance(prev_result, list):
            for result in prev_result:
                self._add_prev_result_to_results(result)
        elif prev_result:
            raise KeyError("Wrong result type in previous task")

    def _merge_result(self, result):
        if isinstance(result, dict):
            return merge_dicts(self.results, result)
        else:
            return self.results

    def _init_params(self, params):
        self.params = params
        try:
            self.job_id = params['job_id']
        except KeyError:
            raise KeyError("job_id has to be set before running a task")
        try:
            self.work_path = params['work_path']
        except KeyError:
            raise KeyError("work_path has to be set before running a task")
        self.log.debug(f"initialized params: {self.params}")


class FileTask(BaseTask):
    """
    Abstract base class for file based tasks.

    Subclasses have to override the process_file method that holds the
    actual conversion logic.
    """
    def execute_task(self):
        file = self.get_param('work_path')
        try:
            target_rep = self.get_param('target')
        except KeyError:
            target_rep = os.path.basename(os.path.dirname(file))
        target_dir = os.path.join(
            os.path.dirname(os.path.dirname(self.get_work_path())),
            target_rep
            )
        os.makedirs(target_dir, exist_ok=True)
        self.process_file(file, target_dir)

    @abstractmethod
    def process_file(self, file, target_dir):
        """
        Process a single file.

        This method has to be implemented by all subclassed tasks and includes
        the actual implementation logic of the specific task.

        :param str file: The path to the file that should be processed
        :param str target_dir: The path of the target directory
        :return None:
        """
        raise NotImplementedError("Process file method not implemented")


class ObjectTask(BaseTask):
    """
    Abstract base class for object based tasks.

    Subclasses have to override the process_object method that holds the
    actual transformation logic.
    """

    def get_object(self):
        return Object(self.get_work_path())

    def execute_task(self):
        return self.process_object(self.get_object())

    @abstractmethod
    def process_object(self, obj):
        """
        Process a single object.

        This method has to be implemented by all subclassed tasks and includes
        the actual implementation logic of the specific task.

        :param Object obj: The cilantro object that should be processed
        :return dict:
        """
        raise NotImplementedError("Process object method not implemented")
