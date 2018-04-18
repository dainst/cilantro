import os

from worker.convert.converter import convert_tif2jpg
from utils.celery_client import celery

working_dir = os.environ['WORKING_DIR']


@celery.task(name="tif_to_jpg")
def tif2jpg(object_id, job_id, prev_task, parent_task, file):
    source = os.path.join(working_dir, job_id, object_id, prev_task)
    target = os.path.join(working_dir, job_id, object_id, parent_task)
    _, extension = os.path.splitext(file)
    new_file = file.replace(extension, '.jpg').replace(source, target)
    convert_tif2jpg(file, new_file)
