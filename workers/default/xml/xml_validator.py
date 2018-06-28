import logging

from lxml import etree

log = logging.getLogger(__name__)


def validate_xml(xml_file_path, dtd_validation=False, schema_file_path=None):
    """
    Parses the given XML file. This throws syntax error if not well formed.
    When the additional schema parameter s given it also checks the XML file
    against that.
    :param str xml_file_path: path to XML file to be validated
    :param str schema_file_path: (optional) path to XSD to be checked against
    :raises etree.XMLSyntaxError: if XML document is not well-formed
    :raises etree.DocumentInvalid: if XML document does not adhere to XSD
    :return: None
    """

    if dtd_validation:
        parser = etree.XMLParser(dtd_validation=True, no_network=False)  # TODO
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
