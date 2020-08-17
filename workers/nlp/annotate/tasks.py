
import logging

from utils.celery_client import celery_app
from workers.base_task import ObjectTask

log = logging.getLogger(__name__)


class AnnotateTask(ObjectTask):
    """
    Annotates a given text.

    Annotates the text and stores the annotations in the json.
    """
    name = "nlp.annotate"

    def process_object(self, obj):
        raise Exception("Not implemented yet.")

    def _get_full_text(self, obj):
        """
        Get the full text from the seperated txts.

        Make it to one big string with new-page markers (\f)in it. This
        improves both, quality and runtime of the annotations.

        :param class obj: The object
        :return str: The complete text, merged from all txts
        """
        raise Exception("Not implemented yet.")


AnnotateTask = celery_app.register_task(AnnotateTask())
