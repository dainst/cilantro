import os
import json

from worker.tasks import BaseTask
from worker.pdf.pdf import cut_pdf
from utils.celery_client import celery_app


class SplitPdfTask(BaseTask):

    name = "split_pdf"

    def execute_task(self):
        work_path = self.get_work_path(self.job_id)
        json_path = os.path.join(work_path, 'data_json/data.json')
        with open(json_path) as data_object:
            data = json.load(data_object)

        cut_pdf(data, work_path)


SplitPdfTask = celery_app.register_task(SplitPdfTask())
