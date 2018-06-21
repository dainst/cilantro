import os
import json
import logging

from utils.celery_client import celery_app
from workers.base_task import BaseTask

from workers.nlp.annotate.annotate import annotate

log = logging.getLogger(__name__)


class AnnotateTask(BaseTask):
    """
    Annotates the text in nlp_text.txt with the params in
    nlp_params.json and stores the annotations in annotations.json
    """
    name = "nlp.annotate"

    def execute_task(self):
        work_path = self.get_work_path()
        json_path = os.path.join(work_path, 'nlp_params.json')
        text_path = os.path.join(work_path, 'nlp_text.txt')

        with open(json_path) as data_object:
            try:
                params = json.load(data_object)
            except json.decoder.JSONDecodeError:
                params = {}
        with open(text_path, 'r') as file:
            text = file.read().replace('\n', '')

        result = annotate(text, params)
        with open(os.path.join(work_path, 'annotations.json'), 'w') as file:
            json.dump(result, file)


AnnotateTask = celery_app.register_task(AnnotateTask())
