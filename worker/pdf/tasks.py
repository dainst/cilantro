import os
import json
from os import listdir
from worker.tasks import BaseTask
from worker.pdf.pdf import cut_pdf
from worker.pdf.jpg_to_pdf import jpg_to_pdf, pdf_merge
from utils.celery_client import celery_app


@celery_app.task(bind=True, name="split_pdf", base=BaseTask)
def task_split_pdf(self, object_id, job_id):
    work_path = self.get_work_path(job_id)
    json_path = os.path.join(work_path, 'data_json/data.json')
    with open(json_path) as data_object:
        data = json.load(data_object)
    cut_pdf(data, work_path)


@celery_app.task(bind=True, name="jpg_to_pdf", base=BaseTask)
def task_jpg_to_pdf(self, object_id, job_id, file=None):
    if file is None:
        raise Exception('NO FILE')
    _, extension = os.path.splitext(file)
    new_file = file.replace(extension, '.converted.pdf')
    jpg_to_pdf(file, new_file)


@celery_app.task(bind=True, name="pdf_merge_converted", base=BaseTask)
def task_pdf_merge_converted(self, object_id, job_id):
    work_path = self.get_work_path(job_id)
    files = list_files(work_path, '.converted.pdf')
    pdf_merge(files, work_path + '/merged.pdf')  # TODO incorporate JSON data for the filename and metadatas.


def list_files(directory, extension):
    return (directory + "/" + f for f in listdir(directory) if f.endswith(extension))
