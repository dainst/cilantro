import os
import json
from worker.pdf.pdf_processor import cut_pdf
from utils.celery_client import celery


@celery.task(name="process_pdf")
def process_pdf(object_id, job_id, prev_task):
    source = os.path.join(os.environ['WORKING_DIR'], job_id, object_id, prev_task)
    target = os.path.join(os.environ['WORKING_DIR'], job_id, object_id, 'process_pdf')
    json_path = os.path.join(source, 'data_json/data.json')
    os.mkdir(target)
    with open(json_path) as data_object:
        data = json.load(data_object)

    cut_pdf(data, source, target)
