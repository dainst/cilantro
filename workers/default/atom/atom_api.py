import os
import logging
import requests

atom_uri = os.environ['ATOM_URI']
atom_api_key = os.environ['ATOM_API_KEY']

repository_uri = os.environ['REPOSITORY_URI']

log = logging.getLogger(__name__)


def get_record(atom_id):
    """Get record from AtoM API."""
    url = f"{atom_uri}/api/informationobjects/{atom_id}"
    response = requests.get(url)
    return response.text


def create_digital_object(obj):
    """
    Create a digitial object for a cilantro object in atom.

    :param str import_xml_file_path: OJS-Import-XML
    :param str journalcode: Name of the journal that will be imported to
    :return: Tuple of return code and text of the POST request to OJS
    """
    url = f"{atom_uri}/api/digitalobjects"
    headers = {'REST-API-Key': atom_api_key}
    data = _get_digital_object_data(obj)
    response = requests.post(url, data=data, headers=headers)
    response.raise_for_status()


def _get_digital_object_data(obj):
    oid = obj.metadata.id
    return {
        'information_object_slug': obj.metadata.atom_id,
        'media_type': 'text',
        'mime_type': 'application/pdf',
        'uri': f"{repository_uri}/file/{oid}/data/pdf/{oid}.pdf",
        'name': f"{oid}.pdf"}
