import os
import json
import logging

from utils.celery_client import celery_app
from workers.base_task import FileTask

from workers.nlp.annotate.annotate import annotate

log = logging.getLogger(__name__)


class AnnotateTask(FileTask):
    """
    Annotates a given text.

    Annotates the text in nlp_text.txt with the params in
    nlp_params.json and stores the annotations in annotations.json.
    """
    name = "nlp.annotate"

    def process_file(self, file, target_dir):
        new_file = self.generate_filename(file, 'json')
        new_file_path = os.path.join(target_dir, new_file)

        with open(file, 'r') as file:
            text = file.read().replace('\n', '')
        if text:
            result = annotate(text)
            with open(new_file_path, 'w+') as file:
                json.dump(result, file)

    @staticmethod
    def generate_filename(file, new_extension):
        _, extension = os.path.splitext(file)
        return os.path.basename(file).replace(extension, f".{new_extension}")


AnnotateTask = celery_app.register_task(AnnotateTask())
