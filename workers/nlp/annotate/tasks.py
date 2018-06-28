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
        work_path = self.get_work_path()
        json_file = os.path.join(work_path, 'nlp_params.json')
        text_file = self.get_param('file')
        _, extension = os.path.splitext(text_file)
        output_file = text_file.replace(extension, '.json')
        try:
            with open(json_file, 'r') as data_object:
                try:
                    params = json.load(data_object)
                except json.decoder.JSONDecodeError:
                    params = {}
        except FileNotFoundError:
            raise Exception("No JSON FILE found")
        with open(text_file, 'r') as file:
            text = file.read().replace('\n', '')

        # result = annotate(text, params)
        result = {
            "message": "Disabled due to runtime",
            "params": params,
            "text": text
        }
        with open(output_file, 'w+') as file:
            json.dump(result, file)


AnnotateTask = celery_app.register_task(AnnotateTask())
