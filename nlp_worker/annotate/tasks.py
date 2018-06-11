import os
import json

from utils.celery_client import celery_app
from worker.tasks import BaseTask

from nlp_worker.annotate.annotate import annotate, get_entities


@celery_app.task(bind=True, name="annotate", base=BaseTask)
def task_annotate(self, object_id, job_id):
    work_path = self.get_work_path(job_id)
    json_path = os.path.join(work_path, 'text.json')
    with open(json_path) as data_object:
        data = json.load(data_object)

    self.update_state(state='PROGRESS',
                      meta={'status': 'Running NLP analysis...'})
    result = annotate(data['text'], data['params'])
    print(result)


@celery_app.task(bind=True, name="get_enteties", base=BaseTask)
def task_get_entities(self, object_id, job_id):
    work_path = self.get_work_path(job_id)
    json_path = os.path.join(work_path, 'text.json')
    with open(json_path) as data_object:
        data = json.load(data_object)

    self.update_state(state='PROGRESS',
                      meta={'status': 'Running NLP analysis...'})
    result = get_entities(data['text'], data['params'])
    print(result)
