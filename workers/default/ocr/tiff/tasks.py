import glob

from utils.celery_client import celery_app

from workers.base_task import BaseTask
from workers.default.ocr.tiff.tiff_to_text import tiff_to_text


class GenerateTextFromTiff(BaseTask):
    name = "tiff_to_text"

    def execute_task(self):
        work_path = self.get_work_path()
        for tiff_file in glob.glob("*.{tif,tiff}"):
            _write_text_to_file(tiff_to_text(tiff_file), os.join(work_path, tiff_file + '.txt'))


GenerateTextFromTiff = celery_app.register_task(GenerateTextFromTiff())


def _write_text_to_file(text, file_path):
    with open(file_path, 'w') as outfile:
        outfile.write(text)
