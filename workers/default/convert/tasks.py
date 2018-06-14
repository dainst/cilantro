import os

from utils.celery_client import celery_app
from workers.base_task import BaseTask
from workers.default.convert.converter import convert_tif_to_jpg


working_dir = os.environ['WORKING_DIR']


class TifToJpgTask(BaseTask):

    name = "convert_tif_to_jpg"

    def execute_task(self):
        file = self.get_param('file')
        _, extension = os.path.splitext(file)
        new_file = file.replace(extension, '.jpg')
        convert_tif_to_jpg(file, new_file)


TifToJpgTask = celery_app.register_task(TifToJpgTask())
