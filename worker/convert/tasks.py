import os

from utils.celery_client import celery_app
from worker.tasks import BaseTask
from worker.convert.converter import convert_tif2jpg, convert_pdf2txts
from utils.celery_client import celery_app

working_dir = os.environ['WORKING_DIR']


class TifToJpgTask(BaseTask):

    name = "convert_tif_to_jpg"

    def execute_task(self):
        file = self.get_param('file')
        _, extension = os.path.splitext(file)
        new_file = file.replace(extension, '.jpg')
        convert_tif_to_jpg(file, new_file)


TifToJpgTask = celery_app.register_task(TifToJpgTask())


class PdfToTxtsTask(BaseTask):
    name = "pdf_to_txts"

    def execute_task(self):
        file = self.get_param('file')
        convert_pdf2txts(file, working_dir)


PdfToTxtsTask = celery_app.register_task(PdfToTxtsTask())
