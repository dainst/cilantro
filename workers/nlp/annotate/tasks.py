import os
import json
import logging

from utils.celery_client import celery_app
from workers.base_task import BaseTask

from workers.nlp.annotate.annotate import annotate

log = logging.getLogger(__name__)


class AnnotateTask(BaseTask):

    name = "nlp.annotate"

    def execute_task(self):
        work_path = self.get_work_path()
        json_path = os.path.join(work_path, 'nlp_params.json')
        text_path = os.path.join(work_path, 'nlp_text.txt')

        with open(json_path) as data_object:
            params = json.load(data_object)
        with open(text_path, 'r') as file:
            text = file.read().replace('\n', '')

        result = annotate(text, params)
        log.info(result)


AnnotateTask = celery_app.register_task(AnnotateTask())
