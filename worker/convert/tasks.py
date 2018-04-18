import os
from PIL import Image
from utils.celery_client import celery

working_dir = os.environ['WORKING_DIR']


@celery.task(name="tif2jpg")
def tif2jpg(object_id, job_id, prev_task, parent_task, file):
    source = os.path.join(working_dir, job_id, object_id, prev_task)
    target = os.path.join(working_dir, job_id, object_id, parent_task)
    _, extension = os.path.splitext(file)
    new_file = file.replace(extension, '.jpg').replace(source, target)
    if file != new_file:
        Image.open(file).save(new_file)
