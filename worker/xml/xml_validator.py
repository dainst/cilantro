import logging

from lxml import etree

log = logging.getLogger(__name__)


def validate_xml(xml_file, schema_file=None):
    xml_doc = etree.parse(xml_file)
    log.info("XML Syntax-Check OK!")

    if (schema_file):
        xmlschema_doc = etree.parse(schema_file)
        xmlschema = etree.XMLSchema(xmlschema_doc)
        xmlschema.assertValid(xml_doc)
        log.info("XSD Schema Validation OK!")
    else:
        log.info("No schema file given. XML validation done.")
