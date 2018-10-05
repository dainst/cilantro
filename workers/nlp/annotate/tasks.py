import os
import json
import logging

from utils.celery_client import celery_app
from workers.base_task import ObjectTask

from workers.nlp.annotate.annotate import annotate

log = logging.getLogger(__name__)


class AnnotateTask(ObjectTask):
    """
    Annotates a given text.

    Annotates the text and stores the annotations in the json.
    """
    name = "nlp.annotate"

    def process_object(self, obj):
        full_text = self._get_full_text(obj)
        json_file = os.path.join(obj.get_representation_dir(
            self.get_param('source')), "annotations.json")

        result = annotate(full_text)
        with open(json_file, 'w+') as file:
            json.dump(result, file)

    def _get_full_text(self, obj):
        """
        Get the full text from the seperated txts.

        Make it to one big string with new-page markers (\f)in it. This
        improves both, quality and runtime of the annotations.

        :param class obj: The object
        :return str: The complete text, merged from all txts
        """
        full_text = ""
        for file2 in obj.get_representation(self.get_param('source')):
            text = file2.read().decode("UTF-8").replace('\n', '')
            full_text += f"{text}\f"
        return full_text


AnnotateTask = celery_app.register_task(AnnotateTask())
