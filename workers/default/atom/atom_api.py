import os
import logging
import requests
from requests.auth import HTTPBasicAuth

atom_uri = os.environ['ATOM_URI']
atom_user = os.environ['ATOM_USER']
atom_password = os.environ['ATOM_PASSWORD']

repository_uri = os.environ['REPOSITORY_URI']

log = logging.getLogger(__name__)


def create_digital_object(obj):
    """
    Create a digitial object for a cilantro object in atom

    :param str import_xml_file_path: OJS-Import-XML
    :param str journalcode: Name of the journal that will be imported to
    :return: Tuple of return code and text of the POST request to OJS
    """
    url = f"{atom_uri}/api/digitalobjects"
    data = _get_digital_object_data(obj)
    auth = HTTPBasicAuth(atom_user, atom_password)
    response = requests.post(url, data=data, auth=auth)
    response.raise_for_status()


def _get_digital_object_data(obj):
    oid = obj.metadata.id
    return {
        'information_object_slug': obj.metadata.atom_id,
        'media_type': 'text',
        'mime_type': 'application/pdf',
        'uri': f"{repository_uri}/file/{oid}/data/pdf/{oid}.pdf",
        'name': f"{oid}.pdf"
    }
