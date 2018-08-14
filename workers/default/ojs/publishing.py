from utils.ojs_api import publish


def publish_to_ojs(import_xml_file_path, journalcode):
    """
    Publish the documents referenced in the passed XML via OJS-Import-Plugin.

    For details see OJS API module.

    :return: tuple containing the response code and text
    """
    return publish(import_xml_file_path, journalcode)
