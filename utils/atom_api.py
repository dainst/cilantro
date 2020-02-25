import os
import logging
import requests
import json

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
    Create a digitial object for a cilantro object in AtoM.

    :param Object obj: THE cilantro object
    :return: str The generated URI for the digital object
    """
    url = f"{atom_uri}/api/digitalobjects"
    headers = {'REST-API-Key': atom_api_key,
               'Content-Type': 'application/json'}
    data = _get_digital_object_data(obj)
    json_data = json.dumps(data, indent=4)
    log.debug(f"Digital object: {json_data}")
    response = requests.post(url, data=json_data, headers=headers)
    response.raise_for_status()
    return f"{atom_uri}/{response.json()['slug']}"


def _get_digital_object_data(obj):
    repository_uri = os.environ['REPOSITORY_URI']
    return {
        'information_object_slug': obj.metadata['atom_id'],
        'media_type': 'text',
        'mime_type': 'application/pdf',
        'uri': f"{repository_uri}/file/{obj.id}/data/pdf/{obj.id}.pdf",
        'name': f"{obj.id}.pdf"}
