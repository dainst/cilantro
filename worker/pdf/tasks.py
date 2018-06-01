import os
import json
import shutil

from worker.pdf.pdf import cut_pdf
from utils.celery_client import celery_app


@celery_app.task(name="split_pdf")
def task_split_pdf(object_id, job_id, prev_task):
    source = os.path.join(os.environ['WORKING_DIR'], job_id, object_id, prev_task)
    target = os.path.join(os.environ['WORKING_DIR'], job_id, object_id, 'split_pdf')

    shutil.copytree(source, target)

    json_path = os.path.join(target, 'data_json/data.json')

    with open(json_path) as data_object:
        data = json.load(data_object)

    cut_pdf(data, target, target)
