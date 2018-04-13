import glob
import os
import shutil

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


@celery.task(name="tasks.convert")
def convert(object_id, prev_task, parent_task, file):
    source = os.path.join(working_dir, object_id, prev_task)
    target = os.path.join(working_dir, object_id, parent_task)
    if not os.path.exists(target):
        try:
            os.makedirs(target)
        except OSError:
            print("could not create dir, eating exception")
    new_file = file.replace('.tif', '.jpg').replace(source, target)
    shutil.copyfile(file, new_file)
