import logging

from lxml import etree

log = logging.getLogger(__name__)


def validate_xml(xml_file_path, schema_file_path=None):
    """
    Parses the given XML file. This throws syntax error if not well formed.
    When the additional schema parameter s given it also checks the XML file against that.
    :param string xml_file_path:
    :param string schema_file_path:
    :return: None
    """
    xml_doc = etree.parse(xml_file_path)
    log.info("XML Syntax-Check OK!")

    if schema_file_path:
        xmlschema_doc = etree.parse(schema_file_path)
        xmlschema = etree.XMLSchema(xmlschema_doc)
        xmlschema.assertValid(xml_doc)
        log.info("XSD Schema Validation OK!")
    else:
        log.info("No schema file given. XML validation done.")
