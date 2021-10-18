import unittest

from workers.default.ojs.ojs_api import publish


class PublishToOJSTest(unittest.TestCase):
    """Test import to OJS via XML-Plugin."""

    def test_publish_to_ojs(self):
        """
        Publish via prebuilt Import-XML.

        Tested are the return code and part of the returned text for a string
        indicating a successful operation.
        """
        ojs_import_file = 'test/resources/files/ojs3_import.xml'

        response_status_code, response = publish(ojs_import_file, 'test')

        self.assertEqual(200, response_status_code)
        self.assertTrue(response['success'])
