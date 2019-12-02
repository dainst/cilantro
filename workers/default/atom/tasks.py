from utils.celery_client import celery_app

from workers.base_task import ObjectTask
from utils.atom_api import create_digital_object


class PublishToAtomTask(ObjectTask):
    """
    Add a digital object for the PDF in the repository to AtoM.

    Preconditions:
    - object metadata must contain atom_id
    - a PDF file named after the object id has to be present in data/pdf/
    """

    name = "publish_to_atom"

    def process_object(self, obj):
        create_digital_object(obj)


PublishToAtomTask = celery_app.register_task(PublishToAtomTask())
