import logging
from io import StringIO

from lxml import etree

log = logging.getLogger(__name__)


def validate_xml(xml_file_path, dtd_file_path=None, schema_file_path=None):
    """
    Validate XML for well-formed, XSD and DTD.

    Parses the given XML file. This throws syntax error if not well formed.
    When the additional schema parameter is given it also checks the XML file
    against that.
    When parameter is given also checks against the DTD referenced in the XML.
    The DTD is downloaded from the web.

    :param str xml_file_path: path to XML file to be validated
    :param str dtd_file_path: (optional) path to DTD to be checked against
    :param str schema_file_path: (optional) path to XSD to be checked against
    :raises etree.XMLSyntaxError: if XML document is not well-formed
    :raises etree.DocumentInvalid: if XML document does not adhere to XSD
    :return: None
    """
    parser = etree.XMLParser(huge_tree=True)

    xml_doc = etree.parse(xml_file_path, parser)
    log.info("XML Syntax-Check OK!")

    if dtd_file_path:
        with open(dtd_file_path, 'r') as f:
            dtd_content = f.read()
        dtd = etree.DTD(StringIO(dtd_content))

        if dtd.validate(xml_doc):
            log.info("DTD Validation OK!")
        else:
            log.warning("XSD Schema Validation FAILED!")
            log.warning(dtd.error_log.filter_from_errors()[0])

    if schema_file_path:
        xmlschema_doc = etree.parse(schema_file_path)
        xmlschema = etree.XMLSchema(xmlschema_doc)
        xmlschema.assertValid(xml_doc)
        log.info("XSD Schema Validation OK!")
