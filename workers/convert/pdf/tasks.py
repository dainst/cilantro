import os
import json

from utils.celery_client import celery_app
from workers.base_task import BaseTask
from workers.convert.pdf.pdf import cut_pdf
from workers.convert.pdf.jpg_to_pdf import convert_jpg_to_pdf, pdf_merge


class SplitPdfTask(BaseTask):
    name = "convert.split_pdf"

    def execute_task(self):
        work_path = self.get_work_path(self.job_id)
        json_path = os.path.join(work_path, 'data_json/data.json')
        with open(json_path, 'r') as data_object:
            data = json.load(data_object)
        data = cut_pdf(data, work_path, work_path)
        with open(json_path, 'w') as data_object:
            json.dump(data, data_object)


class JpgToPdfTask(BaseTask):

    name = "convert.jpg_to_pdf"

    def execute_task(self):
        file = self.get_param("file")
        if file is None:
            raise Exception('NO FILE')
        _, extension = os.path.splitext(file)
        new_file = file.replace(extension, '.converted.pdf')
        convert_jpg_to_pdf(file, new_file)


class PdfMergeConverted(BaseTask):

    name = "convert.pdf_merge_converted"

    def execute_task(self):
        work_path = self.get_work_path(self.job_id)
        files = list_files(work_path, '.converted.pdf')
        pdf_merge(files, work_path + '/merged.pdf')  # TODO incorporate JSON data for the filename and metadatas.


def list_files(directory, extension):
    return (directory + "/" + f for f in os.listdir(directory) if f.endswith(extension))


SplitPdfTask = celery_app.register_task(SplitPdfTask())
JpgToPdfTask = celery_app.register_task(JpgToPdfTask())
PdfMergeConverted = celery_app.register_task(PdfMergeConverted())
