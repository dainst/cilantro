import unittest

from workers.default.ojs.publishing import publish_to_ojs


class PublishToOJSTest(unittest.TestCase):
    """Test import to OJS via XML-Plugin."""

    def test_publish_to_ojs(self):
        """
        Publish via prebuilt Import-XML.

        Tested are the return code and part of the returned text for a string
        indicating a successful operation.
        """
        ojs_import_file = 'test/resources/objects/xml/ojs_import.xml'

        response_status_code, response_text = publish_to_ojs(ojs_import_file)

        self.assertEqual(200, response_status_code)
        self.assertIn('\"success\":true', response_text)

    def test_publish_to_ojs_faulty_xml(self):
        """
        Publish via prebuilt Import-XML which has syntax errors and is to fail.

        Tested are the return code and part of the returned text for a string
        indicating a failed operation.
        """
        ojs_import_file = 'test/resources/objects/xml/ojs_import_faulty.xml'

        response_status_code, response_text = publish_to_ojs(ojs_import_file)

        self.assertNotEqual(200, response_status_code)
        self.assertIn('\"success\":false', response_text)
