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
        template_file = 'mets_template_no_articles.xml'
        target_file_path = os.path.join(obj.path, 'test_ojsxml.xml')
    
        # params = {
        #     "ojs_options": {
        #         "default_create_frontpage": True
        #     }
        # }

        params = {
            'template_file': 'mets_template_no_articles.xml', 
            'target_filename': 'mets.xml', 
            'schema_file': 'mets.xsd', 
            'job_id': '5b7ab852-887b-11ea-b351-0242ac170008', 
            'work_path': '5b79b2ec-887b-11ea-af07-0242ac170008', 
            'parent_job_id': '5b79b2ec-887b-11ea-af07-0242ac170008', 
            'object_id': 'JOURNAL-ZID001149881_1353296', 
            'pdf_base64': '' 
            }

        obj.metadata['title'] = 'Haus vom Nikolaus.'

        obj.metadata['author'] = [{ "firstname": 'Santa', "lastname": 'Claus'}]

        generate_xml(obj, template_file, target_file_path,
                     params)

        self.assertTrue(os.path.isfile(
            f'{self.resource_dir}/objects/a_journal/test_ojsxml.xml'))
        os.remove(f'{self.resource_dir}/objects/a_journal/test_ojsxml.xml')
