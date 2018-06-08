import os
import json

from worker.tasks import BaseTask
from worker.pdf.pdf import cut_pdf
from utils.celery_client import celery_app


@celery_app.task(bind=True, name="split_pdf", base=BaseTask)
def task_split_pdf(self, object_id, job_id):
    work_path = self.get_work_path(job_id)
    json_path = os.path.join(work_path, 'data_json/data.json')
    with open(json_path, 'r') as data_object:
        data = json.load(data_object)
    data = cut_pdf(data, work_path, work_path)
    with open(json_path, 'w') as data_object:
        json.dump(data, data_object)
