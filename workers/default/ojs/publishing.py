"""Module for publishing documents in OJS."""

import requests
import logging

log = logging.getLogger(__name__)


def publish_to_ojs(import_xml_file_path, server='ojs', port='80'):
    """
    Publish the documents referenced in the passed XML via OJS-Import-Plugin.

    The paramter file contains OJS-specific XML which contains file paths to
    documents which shall be imported to OJS. It is read and passed to a POST
    request (in UTF-8) to the OJS import plugin.

    Server address and port can be given optionally.

    The Import-Plugin needs authentication which is (for now) hard-coded.

    :param str import_xml_file_path: OJS-Import-XML
    :param server: OJS server address
    :param port: OJS server port
    :return: Tuple of return code and text of the POST request to OJS
    """
    with open(import_xml_file_path, "r") as f:
        import_data = f.read()

    headers = {'Content-Type': 'application/xml',
               'ojsAuthorization': 'YWRtaW4=:cGFzc3dvcmQ='}

    r = requests.post('http://' + server + ':' + port +
                      '/ojs/plugins/generic/ojs-cilantro-plugin/api/ \
                      import/test',
                      headers=headers,
                      data=import_data.encode(encoding='utf-8'))

    log.debug(r.text)
    return r.status_code, r.text
