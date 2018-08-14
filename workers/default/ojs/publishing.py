import logging
from urllib.request import Request, urlopen
from urllib.error import HTTPError

log = logging.getLogger(__name__)


def publish_to_ojs(import_xml_file_path, journalcode, server='ojs', port='80'):
    """
    Publish the documents referenced in the passed XML via OJS-Import-Plugin.

    The paramter file contains OJS-specific XML which contains file paths to
    documents which shall be imported to OJS. It is read and passed to a POST
    request (in UTF-8) to the OJS import plugin.

    Server address and port can be given optionally.

    The Import-Plugin needs authentication which is (for now) hard-coded.

    :param str import_xml_file_path: OJS-Import-XML
    :param str journalcode: Name of the journal that will be imported to
    :param server: OJS server address
    :param port: OJS server port
    :return: Tuple of return code and text of the POST request to OJS
    """
    with open(import_xml_file_path, "r") as f:
        import_data = f.read()

    headers = {'Content-Type': 'application/xml',
               'ojsAuthorization': 'YWRtaW4=:cGFzc3dvcmQ='}

    request = Request('http://' + server + ':' + port +
                      '/ojs/plugins/generic/ojs-cilantro-plugin/api/import/' +
                      journalcode,
                      headers=headers,
                      data=import_data.encode(encoding='utf-8'))

    with urlopen(request) as response:
        response_text = response.read().decode('utf-8')

    return response.getcode(), response_text
