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
        signature = _create_signature(
            task_def,
            params
        )
        if signature:
            chain |= signature
    return chain


def _extract_job_type(file_name):
    """
    Strip the extension from the file_name.

    :param str file_name:
    :return str:
    """
    return os.path.splitext(os.path.basename(file_name))[0]


def _read_job_config_file(file_name):
    try:
        file = open(file_name, 'r')
        return yaml.load(file)
    except Exception as err:
        raise ConfigParseException(
            f"Error while reading job type definition from {file_name}: {err}"
        )
    finally:
        file.close()


def _validate_job_config(job_config, job_type):
    if 'tasks' not in job_config:
        raise ConfigParseException(
            f"Missing attribute 'tasks' in job type {job_type}"
        )
    if not isinstance(job_config['tasks'], list):
        raise ConfigParseException(
            f"Attribute 'tasks' is no list in job type {job_type}"
        )


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
    that can be defined with foreach and if.

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
    elif 'foreach' in task_def:
        return {
            'type': 'foreach',
            'name': 'foreach',
            'pattern': task_def['foreach'],
            'do': _expand_tasks_def(task_def['do'])
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
    if task_def['type'] == 'foreach':
        return _create_foreach_signature(task_def, params)
    if task_def['type'] == 'if':
        return _create_if_signature(task_def, params)
    return _create_signature_for_task(task_def, params)


def _create_foreach_signature(task_def, params):
    kwargs = params.copy()
    kwargs['pattern'] = task_def['pattern']
    kwargs['subtasks'] = task_def['do']
    return celery_app.signature('foreach', kwargs=kwargs, immutable=True)


def _create_if_signature(task_def, params):
    if eval(task_def['condition'], None, params):
        return generate_chain(task_def['do'], params)
    else:
        return _evaluate_else(task_def, params)


def _evaluate_else(task_def, params, ):
    if 'else' in task_def:
        return generate_chain(task_def['else'], params)
    else:
        return False


def _create_signature_for_task(task_def, params=None):
    kwargs = {}
    if 'params' in task_def:
        kwargs.update(task_def['params'])
    if params:
        kwargs.update(params)
    return celery_app.signature(task_def['name'], kwargs=kwargs, immutable=True)


def _init_default_params(params):
    """
    Read the params attribute of the job config and set default values.

    Default values are based on the types given in the config.

    :param dict params:
    :return dict:
    """
    default_params = {}
    for param_name, param_type in params.items():
        if param_type == 'boolean':
            default_params[param_name] = False
        elif param_type == 'string':
            default_params[param_name] = ''
        elif param_type == 'list':
            default_params[param_name] = []
        elif param_type == 'dict':
            default_params[param_name] = {}
        else:
            raise ConfigParseException(
                f"Parameter type '{param_type}' for "
                f"parameter '{param_name}' is invalid!"
            )
    return default_params


def _validate_request_params(default_params, request_params):
    """
    Validate and merge the request parameters.

    :param dict default_params:
    :param dict request_params:
    :return dict: default params overridden with request params
    """
    logging.getLogger(__name__).debug(f"request_params: {request_params}")
    params = default_params
    if request_params:
        for request_param in request_params:
            if request_param in params:
                expected_type = type(params[request_param])
                request_param_value = request_params[request_param]
                if isinstance(request_param_value, expected_type):
                    params[request_param] = request_params[request_param]
                else:
                    raise RequestParameterException(
                        f"Wrong parameter type: '{request_param}' is expected "
                        f"to be '{expected_type}' but was "
                        f"'{type(request_param_value)}'"
                    )
            else:
                raise RequestParameterException(
                    f"Unknown request parameter '{request_param}'!"
                )
    return params


class JobConfig:
    """
    Handle job config parsing and job chain creation.

    Chains are created based on the YAML job_type definition found in the
    config directory.

    Parameters for tasks can be set in three different places:
    1. Default values are generated based on the data type configured in the
       params section of the job config YAML.
    2. Task specific parameters can be set in the tasks section of the job
       config.
    3. Additional parameters that override the values derived from the job
       config can be set when creating a job chain.

    :param str _config_dir: path to the configuration directory.
    """

    def __init__(self, _config_dir=None):
        """
        Initialize the config and triggers the parsing of the YAML files.
        """
        self.logger = logging.getLogger(__name__)
        if _config_dir:
            self._config_dir = _config_dir
        else:
            self._config_dir = os.environ['CONFIG_DIR']
        self.job_types = {}
        self._parse_job_config()

    def generate_job(self, job_type, user, request_params=None):
        """
        Generate a celery job chain.

        :param str job_type: The name of the config file that defines the job
        :param dict request_params: Additional parameters that overwrite the
            default parameters
        :return Job:
        """
        if job_type not in self.job_types:
            raise UnknownJobTypeException(
                f"No definition for given job type '{job_type}' found")
        tasks_def = self.job_types[job_type]['tasks']
        default_params = self.job_types[job_type]['params']
        params = _validate_request_params(default_params, request_params)
        params['user'] = user
        return Job(generate_chain(tasks_def, params))

    def _parse_job_config(self):
        pattern = os.path.join(self._config_dir, "job_types", "*.yml")
        self.logger.debug(f"looking for job type configs in {pattern}")
        for file_name in glob.iglob(pattern):
            self.logger.info(f"found job type config {file_name}")
            job_type = _extract_job_type(file_name)
            self.logger.debug(f"extracted job type defintion {job_type}")
            job_config = _read_job_config_file(file_name)
            _validate_job_config(job_config, job_type)
            try:
                default_params = _init_default_params(job_config['params'])
            except KeyError:
                default_params = {}
            expanded_tasks = _expand_tasks_def(job_config['tasks'])
            self.job_types[job_type] = {
                'params': default_params,
                'tasks': expanded_tasks
            }
        self.logger.debug(f"job types: {self.job_types}")
