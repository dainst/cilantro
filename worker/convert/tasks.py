import os
import shutil

from utils.celery_client import celery

working_dir = os.environ['WORKING_DIR']


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