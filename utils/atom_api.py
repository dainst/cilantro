import os
import logging
import requests

atom_uri = os.environ['ATOM_URI']
atom_api_key = os.environ['ATOM_API_KEY']

log = logging.getLogger(__name__)


def get_record(atom_id):
    """Get record from AtoM API."""
    url = f"{atom_uri}/api/informationobjects/{atom_id}"
    headers = {'REST-API-Key': atom_api_key}
    response = requests.get(url, headers=headers)
    return response.text


def create_digital_object(obj):
    """
    Create a digitial object for a cilantro object in atom.

    :param Object obj: THE cilantro object
    :return: None
    """
    url = f"{atom_uri}/api/digitalobjects"
    headers = {'REST-API-Key': atom_api_key}
    data = _get_digital_object_data(obj)
    response = requests.post(url, data=data, headers=headers)
    response.raise_for_status()


def _get_digital_object_data(obj):
    repository_uri = os.environ['REPOSITORY_URI']
    oid = obj.metadata.id
    return {
        'information_object_slug': obj.metadata.atom_id,
        'media_type': 'text',
        'mime_type': 'application/pdf',
        'uri': f"{repository_uri}/file/{oid}/data/pdf/{oid}.pdf",
        'name': f"{oid}.pdf"}
