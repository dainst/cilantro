import yaml
import glob
import os
import logging

from service.job.job import Job
from utils.celery_client import celery_app


class ConfigParseException(Exception):
    pass


class UnknownJobTypeException(Exception):
    pass


class RequestParameterException(Exception):
    pass


def generate_chain(tasks_def, params=None):
    """
    Create a celery task chain.

    :param list tasks_def: A list of (expanded) task definition objects
    :param dict params: Additional params that are made available to all tasks
    :return Chain: Celery task chain
    """
    chain = _create_signature(tasks_def[0], params)
    for task_def in tasks_def[1:]:
        signature = _create_signature(task_def, params)
        if signature:
            chain |= signature
    return chain


def _extract_job_type(file_name):
    """
    Strip the extension from the file_name.

    :param str file_name: original file name
    :return str: basename of the filename
    """
    return os.path.splitext(os.path.basename(file_name))[0]


def _read_job_config_file(file_name):
    try:
        file = open(file_name, 'r')
        return yaml.load(file)
    except Exception as err:
        raise ConfigParseException(
            f"Error while reading job type definition from {file_name}: {err}")
    finally:
        file.close()


def _validate_job_config(job_config, job_type):
    if 'tasks' not in job_config:
        raise ConfigParseException(
            f"Missing attribute 'tasks' in job type {job_type}")
    if not isinstance(job_config['tasks'], list):
        raise ConfigParseException(
            f"Attribute 'tasks' is no list in job type {job_type}")


def _expand_tasks_def(tasks_def):
    """
    Expand a list of task definitions given in the YAML config.

    This creates task definition objects for every task in the list.

    In YAML tasks defintions can be abbreviated and this method ensures that
    a unified API exists for evaluating task definitions.

    :param list tasks_def: A list of task defintions to be expanded
    :return list: The list of expanded task defintion objects
    """
    task_list = []
    if not isinstance(tasks_def, list):
        tasks_def = [tasks_def]
    for task_def in tasks_def:
        task_list.append(_expand_task_def(task_def))
    return task_list


def _expand_task_def(task_def):
    """
    Expand a single task definition.

    Recursively calls _expand_tasks_def in order to expand complex task trees
    that can be defined with list_files and if.

    :param object task_def: Task definition, may be a string or a dict
    :return dict: Task definition as dictionary
    """
    if isinstance(task_def, str):
        return {
            'type': 'task',
            'name': task_def
            }
    elif 'task' in task_def:
        task_name = task_def.pop('task')
        return {
            'type': 'task',
            'name': task_name,
            'params': task_def
            }
    elif 'list_files' in task_def:
        expanded_task = {
            'type': 'list_files',
            'name': 'list_files',
            'representation': task_def['list_files'],
            'pattern': ".*",
            'foreach': _expand_tasks_def(task_def['foreach'])
            }
        if 'pattern' in task_def:
            expanded_task['pattern'] = task_def['pattern']
        return expanded_task
    elif 'list_parts' in task_def:
        return {
            'type': 'list_parts',
            'name': 'list_parts',
            'foreach': _expand_tasks_def(task_def['foreach'])
            }
    elif 'if' in task_def:
        expanded_task = {
            'type': 'if',
            'name': 'if',
            'condition': task_def['if'],
            'do': _expand_tasks_def(task_def['do'])
            }
        if 'else' in task_def:
            expanded_task['else'] = _expand_tasks_def(task_def['else'])
        return expanded_task


def _create_signature(task_def, params=None):
    if task_def['type'] == 'list_files':
        return _create_list_files_signature(task_def, params)
    if task_def['type'] == 'list_parts':
        return _create_list_parts_signature(task_def, params)
    if task_def['type'] == 'if':
        return _create_if_signature(task_def, params)
    return _create_signature_for_task(task_def, params)


def _create_list_files_signature(task_def, params):
    kwargs = params.copy()
    kwargs['representation'] = task_def['representation']
    kwargs['pattern'] = task_def['pattern']
    kwargs['subtasks'] = task_def['foreach']
    return celery_app.signature('list_files', kwargs=kwargs)


def _create_list_parts_signature(task_def, params):
    kwargs = params.copy()
    kwargs['subtasks'] = task_def['foreach']
    return celery_app.signature('list_parts', kwargs=kwargs)


def _create_if_signature(task_def, params):
    kwargs = params.copy()
    kwargs['condition'] = task_def['condition']
    kwargs['do'] = task_def['do']
    if 'else' in task_def:
        kwargs['else'] = task_def['else']
    return celery_app.signature('if', kwargs=kwargs, immutable=True)


def _create_signature_for_task(task_def, params=None):
    kwargs = {}
    if 'params' in task_def:
        kwargs.update(task_def['params'])
    if params:
        kwargs.update(params)
    return celery_app.signature(task_def['name'], kwargs=kwargs)


class JobConfig:
    """
    Handle job config parsing and job chain creation.

    Chains are created based on the YAML job_type definition found in the
    config directory.

    Parameters for tasks can be set in three different places:
    1. Default values are generated based on the data type configured in the\
       params section of the job config YAML.
    2. Task specific parameters can be set in the tasks section of the job\
       config.
    3. Additional parameters that override the values derived from the job\
       config can be set when creating a job chain.

    :param str _config_dir: path to the configuration directory.
    """

    def __init__(self, _config_dir=None):
        """Initialize the config and triggers the parsing of the YAML files."""
        self.logger = logging.getLogger(__name__)
        if _config_dir:
            self._config_dir = _config_dir
        else:
            self._config_dir = os.environ['CONFIG_DIR']
        self.job_types = {}
        self._parse_job_config()

    def generate_job(self, job_type, user, request_params):
        """
        Generate a celery job chain.

        :param str job_type: The name of the config file that defines the job
        :param str user: The user who started the job
        :param dict request_params: Parameters passed in the request
        :return Job:
        """
        if job_type not in self.job_types:
            raise UnknownJobTypeException(
                f"No definition for given job type '{job_type}' found")
        tasks_def = self.job_types[job_type]['tasks']
        request_params['user'] = user
        return Job(generate_chain(tasks_def, request_params))

    def _parse_job_config(self):
        pattern = os.path.join(self._config_dir, "job_types", "*.yml")
        self.logger.debug(f"looking for job type configs in {pattern}")
        for file_name in glob.iglob(pattern):
            self.logger.debug(f"found job type config {file_name}")
            job_type = _extract_job_type(file_name)
            self.logger.debug(f"extracted job type defintion {job_type}")
            job_config = _read_job_config_file(file_name)
            _validate_job_config(job_config, job_type)
            expanded_tasks = _expand_tasks_def(job_config['tasks'])
            self.job_types[job_type] = {'tasks': expanded_tasks}
        self.logger.debug(f"job types: {self.job_types}")
