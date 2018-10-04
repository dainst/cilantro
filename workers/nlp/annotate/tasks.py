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
        txt_folder = obj.get_representation_dir(self.get_param('source'))
        full_text = _get_full_text(txt_folder)
        json_file = os.path.join(txt_folder, "annotations.json")

        result = annotate(full_text)
        with open(json_file, 'w+') as file:
            json.dump(result, file)


AnnotateTask = celery_app.register_task(AnnotateTask())


def _get_full_text(folder):
    """
    Get the full text from the seperated txts.

    Make it to one big string with new-page markers (\f)in it. This
    improves both, quality and runtime of the annotations.

    :param str folder: The folder which is searched for the txts
    :return str: The complete text, merged from all txts
    """
    full_text = ""
    page = 0
    while True:
        file = os.path.join(folder, f"merged_{page}.txt")
        if os.path.isfile(file):
            with open(file, 'r') as f:
                text = f.read().replace('\n', '')
                full_text += f"{text}\f"
            page += 1
        else:
            break
    return full_text
