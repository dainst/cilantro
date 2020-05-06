import os
import logging
import json
from urllib.request import Request, urlopen
from urllib.error import HTTPError

omp_api_uri = os.environ['OMP_URI']
auth_key = os.environ['OMP_AUTH_KEY']

log = logging.getLogger(__name__)


def publish(import_xml_file_path, press_code):
    """
    Publish the documents referenced in the passed XML via OMP-Import-Plugin.

    The paramater file contains OMP-specific XML which contains file paths to
    documents which shall be imported to OJS. It is read and passed to a POST
    request (in UTF-8) to the OJS import plugin.

    Server address and port can be given optionally.

    The Import-Plugin needs authentication which is (for now) hard-coded.

    :param str import_xml_file_path: OMP-Import-XML
    :param str press_code: Name of press that will be imported to
    :return: Tuple of return code and text of the POST request to OJS
    """
    with open(import_xml_file_path, "r") as f:
        import_data = f.read()

    headers = {'Content-Type': 'application/xml',
               'ompAuthorization': auth_key}
    request_url = f"{_get_api_url()}/import/{press_code}"
    return _make_request(request_url, headers,
                         import_data.encode(encoding='utf-8'))


def _get_api_url():
    return omp_api_uri


def _make_request(url, headers, import_data=None):
    """Make the request to OMP and return response code and content."""
    log.debug(f"Request: URL: {url} Headers: {headers} Data: {import_data}")

    request = Request(url, headers=headers,
                      data=import_data)

    try:
        with urlopen(request) as response:
            response_text = response.read().decode('utf-8')
    except HTTPError as e:
        log.error(f"Request failed with: {e.read()}")
        raise

    try:
        return response.getcode(), json.loads(response_text)
    except json.JSONDecodeError as e:
        log.error(f"Failed to parse response as JSON: {response_text}")
        raise
