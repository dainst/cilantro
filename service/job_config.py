import yaml
import glob
import os
from celery import signature


class ConfigParseException(Exception):
    pass


def _extract_job_type(file_name):
    return os.path.splitext(os.path.basename(file_name))[0]


def _read_job_config_file(file_name):
    try:
        file = open(file_name, 'r')
        return yaml.load(file)
    except Exception as err:
        raise ConfigParseException("Error while reading job type definition from %s: %s" % (file_name, err))


def _create_task_def(task):
    if isinstance(task, str):
        return {'name': task}
    else:
        task_name = next(iter(task))  # first key
        return {'name': task_name, 'params': task[task_name]}


def _create_signature(task_def, object_id, prev_task=None):
    kwargs = {'object_id': object_id}
    if prev_task is not None:
        kwargs['prev_task'] = prev_task
    if 'params' in task_def:
        kwargs.update(task_def['params'])
    return signature("tasks.%s" % task_def['name'], kwargs=kwargs, immutable=True)


class JobConfig:

    def __init__(self):
        self._config_dir = os.environ['CONFIG_DIR']
        self.job_types = {}
        self._parse_job_config()

    def generate_job(self, job_type, object_id):
        job_def = self.job_types[job_type]
        job = _create_signature(_create_task_def(job_def[0]), object_id)
        prev_task = job_def[0]
        for task in job_def[1:]:
            task_def = _create_task_def(task)
            job |= _create_signature(task_def, object_id, prev_task)
            prev_task = task_def['name']
        return job

    def _parse_job_config(self):
        pattern = os.path.join(self._config_dir, "job_types", "*.yml")
        print("looking for job type configs in %s" % pattern)
        print(os.getcwd())
        for file_name in glob.iglob(pattern):
            print("found job type config in %s" % file_name)
            job_type = _extract_job_type(file_name)
            print("extracted job type defintion %s" % job_type)
            self.job_types[job_type] = _read_job_config_file(file_name)
            if not isinstance(self.job_types[job_type], list):
                raise ConfigParseException("Error while reading job type definition: %s has to contain list at root")
