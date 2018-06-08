import os

from worker.tasks import BaseTask
from worker.convert.converter import convert_tif2jpg
from utils.celery_client import celery_app

working_dir = os.environ['WORKING_DIR']


class TifToJpgTask(BaseTask):

    name = "tif_to_jpg"

    def execute_task(self):
        file = self.get_param('file')
        _, extension = os.path.splitext(file)
        new_file = file.replace(extension, '.jpg')
        convert_tif2jpg(file, new_file)


celery_app.register_task(TifToJpgTask())
