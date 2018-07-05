import logging

from lxml import etree

log = logging.getLogger(__name__)


def validate_xml(xml_file_path, dtd_validation=False, schema_file_path=None):
    """
    Validate XML for well-formed, XSD and DTD.

    Parses the given XML file. This throws syntax error if not well formed.
    When the additional schema parameter is given it also checks the XML file
    against that.
    When parameter is given also checks against the DTD referenced in the XML.
    The DTD is downloaded from the web.

    :param str xml_file_path: path to XML file to be validated
    :param bool dtd_validation: Switch to check against the referenced DTD
    :param str schema_file_path: (optional) path to XSD to be checked against
    :raises etree.XMLSyntaxError: if XML document is not well-formed
    :raises etree.DocumentInvalid: if XML document does not adhere to XSD
    :return: None
    """

    if dtd_validation:
        parser = etree.XMLParser(dtd_validation=True, no_network=False)
    else:
        parser = etree.XMLParser()

    xml_doc = etree.parse(xml_file_path, parser)
    log.info("XML Syntax-Check OK!")

    if schema_file_path:
        xmlschema_doc = etree.parse(schema_file_path)
        xmlschema = etree.XMLSchema(xmlschema_doc)
        xmlschema.assertValid(xml_doc)
        log.info("XSD Schema Validation OK!")
    else:
        log.info("No schema file given. XML validation done.")
