import os

from worker.tasks import BaseTask
from worker.convert.converter import convert_tif_to_jpg, convert_pdf_to_txt, convert_pdf_to_tif
from utils.celery_client import celery_app

working_dir = os.environ['WORKING_DIR']


class TifToJpgTask(BaseTask):
    name = "convert.tif_to_jpg"

    def execute_task(self):
        file = self.get_param('file')
        _, extension = os.path.splitext(file)
        new_file = file.replace(extension, '.jpg')
        convert_tif_to_jpg(file, new_file)


TifToJpgTask = celery_app.register_task(TifToJpgTask())


class ConvertPdfToTxtTask(BaseTask):
    name = "convert.pdf_to_txt"

    def execute_task(self):
        file = self.get_param('file')
        convert_pdf_to_txt(file, working_dir)


PdfToTxtsTask = celery_app.register_task(ConvertPdfToTxtTask())


class ConvertPdfToTifTask(BaseTask):
    name = "convert.pdf_to_tif"

    def execute_task(self):
        file = self.get_param('file')
        convert_pdf_to_tif(file, working_dir)


PdfToTifsTask = celery_app.register_task(ConvertPdfToTifTask())
