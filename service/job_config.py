import yaml
import glob
import os
from celery import signature

config_dir = os.environ['CONFIG_DIR']

class JobConfig:

    def __init__(self):

        self.job_types = { }
        pattern = os.path.join(config_dir, "job_types", "*.yml")
        print("reading job config from %s" % pattern)
        for file_name in glob.iglob(pattern):
            print("found job type defintion %s" % file_name)
            job_type = os.path.splitext(os.path.basename(file_name))[0]
            try:
                file = open(file_name, 'r')
                self.job_types[job_type] = yaml.load(file)
            except Exception as err:
                print("Error while reading job type definition from %s: %s" % (file_name, err))

    def generate_job(self, job_type, object_id):
        job_def = self.job_types[job_type]
        job = signature("tasks.%s" % job_def[0], [object_id], immutable=True)
        prev_task = job_def[0]
        for task in job_def[1:]:
            task_name = task
            args = [object_id]
            if not prev_task is None:
                args.append(prev_task)
            if not isinstance(task, str):
                task_name = next(iter(task)) # first key
                for key, val in task[task_name].items():
                    args.append(val)
            job |= signature("tasks.%s" % task_name, args, immutable=True)
            prev_task = task_name
        return job
