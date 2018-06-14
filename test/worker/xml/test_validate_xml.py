import unittest

from lxml import etree

from worker.xml.xml_validator import validate_xml


class ValidateXMLTest(unittest.TestCase):

    ojs_xml_file = 'test/resources/objects/xml/ojs_import.xml'
    ojs_xml_file_faulty = 'test/resources/objects/xml/ojs_import_faulty.xml'
    marc_xml_file = 'test/resources/objects/xml/marc.xml'
    marc_xml_file_faulty = 'test/resources/objects/xml/marc_faulty.xml'
    marc_schema_file = 'resources/MARC21slim.xsd'

    def test_validate_xml(self):
        xml_file = self.ojs_xml_file
        validate_xml(xml_file)

    def test_validate_xml_with_schema(self):
        xml_file = self.marc_xml_file
        xml_schema_file = self.marc_schema_file
        validate_xml(xml_file, xml_schema_file)

    def test_validation_failed_by_syntax(self):
        xml_file = self.ojs_xml_file_faulty
        self.assertRaises(etree.XMLSyntaxError, validate_xml, xml_file)

    def test_validation_failed_by_schema(self):
        xml_file = self.marc_xml_file_faulty
        xml_schema_file = self.marc_schema_file
        self.assertRaises(etree.DocumentInvalid, validate_xml, xml_file, xml_schema_file)
