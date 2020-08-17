import logging

from utils.celery_client import celery_app

from workers.base_task import ObjectTask
from utils.atom_api import create_digital_object
from requests import HTTPError


log = logging.getLogger(__name__)


class PublishToAtomTask(ObjectTask):
    """
    Add a digital object for the PDF in the repository to AtoM.

    Preconditions:
    - object metadata must contain atom_id
    - a PDF file named after the object id has to be present in data/pdf/
    """

    name = "publish_to_atom"

    def process_object(self, obj):
        try:
            uri = create_digital_object(obj)
            log.info(f"Created digital object in AtoM: {uri}")
        except HTTPError as err:
            msg = (
                f"Error while creating digital object in AtoM: {err}, response: {err.response.text}\n"
                f"Hint: Internal server errors are often caused by AtoM failing to resolve the repository "
                f"URI given for the digital objekt in the request body."
            )
            log.error(msg)
            raise RuntimeError(msg)


PublishToAtomTask = celery_app.register_task(PublishToAtomTask())
