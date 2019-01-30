import unittest
import os
import logging

from workers.default.xml.xml_generator import generate_xml
from utils.object import Object

log = logging.getLogger(__name__)


class GenerateXMLTest(unittest.TestCase):
    """Testing the generation of XML with the jinja templating engine."""

    resource_dir = os.environ['TEST_RESOURCE_DIR']

    def test_generate_ojsxml(self):
        """
        Test XML generation with example template for OJS-Import.

        It is only tested if a file was generated. No further content
        checks.
        """
        obj = Object(f'{self.resource_dir}/objects/a_journal')
        template_file = 'ojs_template.xml'
        target_file_path = os.path.join(obj.path, 'test_ojsxml.xml')
        params = {
            "ojs_metadata": {
                "ojs_journal_code": "test",
                "ojs_user": "ojs_user",
                "auto_publish_issue": False,
                "default_publish_articles": True,
                "default_create_frontpage": True,
                "allow_upload_without_file": False}}

        generate_xml(obj, template_file, target_file_path,
                     params)

        self.assertTrue(os.path.isfile(
            f'{self.resource_dir}/objects/a_journal/test_ojsxml.xml'))
        os.remove(f'{self.resource_dir}/objects/a_journal/test_ojsxml.xml')
