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


def _extract_job_type(file_name):
    return os.path.splitext(os.path.basename(file_name))[0]


def _read_job_config_file(file_name):
    try:
        file = open(file_name, 'r')
        return yaml.load(file)
    except Exception as err:
        raise ConfigParseException(
            "Error while reading job type definition from %s: %s"
            % (file_name, err))
    finally:
        file.close()


def _validate_job_config(job_config, job_type):
    if 'tasks' not in job_config:
        raise ConfigParseException(
            "Missing attribute 'tasks' in job type %s" % job_type)
    if not isinstance(job_config['tasks'], list):
        raise ConfigParseException(
            "Attribute 'tasks' is no list in job type %s" % job_type)


def _expand_tasks_def(tasks_def):
    task_list = []
    if not isinstance(tasks_def, list):
        tasks_def = [tasks_def]
    for task_def in tasks_def:
        task_list.append(_expand_task_def(task_def))
    return task_list


def _expand_task_def(task_def):
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


def generate_chain(object_id, tasks_def, request_params=None, prev_task=None):
    chain = _create_signature(tasks_def[0], object_id, request_params)
    if not prev_task:
        prev_task = tasks_def[0]['name']
    for task_def in tasks_def[1:]:
        signature = _create_signature(task_def, object_id,
                                      request_params, prev_task)
        if signature:
            chain |= signature
        prev_task = task_def['name']
    return chain


def _create_signature(task_def, object_id, request_params=None, prev_task=None):
    if task_def['type'] == 'foreach':
        return _create_foreach_signature(task_def, object_id, prev_task)
    if task_def['type'] == 'if':
        return _create_if_signature(task_def, object_id,
                                    request_params, prev_task)
    return _create_signature_for_task(task_def, object_id,
                                      request_params, prev_task)


def _create_foreach_signature(task_def, object_id, prev_task=None):
    kwargs = {
        'object_id': object_id,
        'pattern': task_def['pattern'],
        'subtasks': task_def['do']
    }
    if prev_task:
        kwargs['prev_task'] = prev_task
    return celery_app.signature('foreach', kwargs=kwargs, immutable=True)


def _create_if_signature(task_def, object_id, request_params, prev_task=None):
    if eval(task_def['condition'], request_params):
        return generate_chain(object_id, task_def['do'],
                              request_params, prev_task)
    else:
        return _evaluate_else(task_def, object_id,
                              request_params, prev_task)


def _evaluate_else(task_def, object_id, request_params, prev_task=None):
    if 'else' in task_def:
        return generate_chain(object_id, task_def['else'],
                              request_params, prev_task)
    else:
        return False


def _create_signature_for_task(task_def, object_id,
                               request_params=None, prev_task=None):
    kwargs = {'object_id': object_id}
    if prev_task is not None:
        kwargs['prev_task'] = prev_task
    if 'params' in task_def:
        kwargs.update(task_def['params'])
    if request_params:
        kwargs.update(request_params)
    return celery_app.signature(task_def['name'], kwargs=kwargs, immutable=True)


def _init_default_params(params):
    default_params = {}
    for param_name, param_type in params.items():
        if param_type == 'boolean':
            default_params[param_name] = False
        elif param_type == 'string':
            default_params[param_name] = ''
        else:
            raise ConfigParseException(
                f"Parameter type '{param_type}' for "
                f"parameter '{param_name}' is invalid!")
    return default_params


class JobConfig:

    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self._config_dir = os.environ['CONFIG_DIR']
        self.job_types = {}
        self._parse_job_config()

    def generate_job(self, job_type, object_id, request_params=None):
        if job_type not in self.job_types:
            raise UnknownJobTypeException(
                "No definition for given job type '%s' found" % job_type)
        tasks_def = self.job_types[job_type]['tasks']
        default_params = self.job_types[job_type]['params']
        if request_params is None:
            request_params = {}
        params = {**default_params, **request_params}
        return Job(generate_chain(object_id, tasks_def, params))

    def _parse_job_config(self):
        pattern = os.path.join(self._config_dir, "job_types", "*.yml")
        self.logger.debug("looking for job type configs in %s" % pattern)
        for file_name in glob.iglob(pattern):
            self.logger.info("found job type config in %s" % file_name)
            job_type = _extract_job_type(file_name)
            self.logger.debug("extracted job type defintion %s" % job_type)
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
        self.logger.debug(("job types: %s" % self.job_types))
