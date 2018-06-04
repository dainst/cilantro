import os
import json

from worker.tasks import BaseTask
from worker.marcxml.marcxml_generator import generate_marcxml
from utils.celery_client import celery_app


@celery_app.task(bind=True, name="generate_marcxml", base=BaseTask)
def task_generate_marcxml(self, object_id, job_id):
    work_path = self.get_work_path(job_id)

    json_path = os.path.join(work_path, 'data_json/data.json')
    with open(json_path) as data_object:
        data = json.load(data_object)

    generate_marcxml(data, work_path)
