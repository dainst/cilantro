import os

from worker.tasks import BaseTask
from worker.convert.converter import convert_tif2jpg
from utils.celery_client import celery_app

working_dir = os.environ['WORKING_DIR']


@celery_app.task(bind=True, name="tif_to_jpg", base=BaseTask)
def tif2jpg(self, object_id, job_id, file):
    _, extension = os.path.splitext(file)
    new_file = file.replace(extension, '.jpg')
    convert_tif2jpg(file, new_file)
