import os
import json
import logging

from utils.celery_client import celery_app
from workers.base_task import BaseTask

from workers.nlp.annotate.annotate import annotate

log = logging.getLogger(__name__)


class AnnotateTask(BaseTask):
    """
    Annotates a given text.

    Annotates the text in nlp_text.txt with the params in
    nlp_params.json and stores the annotations in annotations.json.
    """
    name = "nlp.annotate"

    def execute_task(self):
        params = self.get_param('nlp_params')
        text_file = self.get_param('file')
        _, extension = os.path.splitext(text_file)
        output_file = text_file.replace(extension, '.json')

        with open(text_file, 'r') as file:
            text = file.read().replace('\n', '')

        result = annotate(text, params)
        with open(output_file, 'w+') as file:
            json.dump(result, file)


AnnotateTask = celery_app.register_task(AnnotateTask())
