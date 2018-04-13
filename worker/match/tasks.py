import glob
import os

from celery import signature, group

from utils.celery_client import celery

repository_dir = os.environ['REPOSITORY_DIR']
working_dir = os.environ['WORKING_DIR']


@celery.task(bind=True, name="tasks.match")
def match(self, object_id, prev_task, pattern, run):
    source = os.path.join(working_dir, object_id, prev_task)
    subtasks = []
    for file in glob.iglob(os.path.join(source, pattern)):
        subtasks.append(signature("tasks.%s" % run, [object_id, prev_task, 'match', file]))
    raise self.replace(group(subtasks))
