import os
import json

from utils.celery_client import celery_app
from worker.tasks import BaseTask
from worker.pdf.pdf import cut_pdf
from worker.pdf.jpg_to_pdf import convert_jpg_to_pdf, pdf_merge


class SplitPdfTask(BaseTask):
    name = "split_pdf"

    def execute_task(self):
        work_path = self.get_work_path(self.job_id)
        json_path = os.path.join(work_path, 'data_json/data.json')
        with open(json_path, 'r') as data_object:
            data = json.load(data_object)
        data = cut_pdf(data, work_path, work_path)
        with open(json_path, 'w') as data_object:
            json.dump(data, data_object)


class ConvertJpgToPdfTask(BaseTask):
    name = "convert_jpg_to_pdf"

    def execute_task(self):
        file = self.get_param("file")
        if file is None:
            raise Exception('NO FILE')
        _, extension = os.path.splitext(file)
        new_file = file.replace(extension, '.converted.pdf')
        convert_jpg_to_pdf(file, new_file)


class MergeConvertedPdfsTask(BaseTask):
    name = "merge_converted_pdfs"

    def execute_task(self):
        work_path = self.get_work_path(self.job_id)
        files = list_files(work_path, '.converted.pdf')
        pdf_merge(files, work_path + '/merged.pdf')  # TODO incorporate JSON data for the filename and metadatas.


def list_files(directory, extension):
    return (directory + "/" + f for f in os.listdir(directory) if f.endswith(extension))


SplitPdfTask = celery_app.register_task(SplitPdfTask())
JpgToPdfTask = celery_app.register_task(ConvertJpgToPdfTask())
PdfMergeConverted = celery_app.register_task(MergeConvertedPdfsTask())
