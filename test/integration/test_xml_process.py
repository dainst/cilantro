import os
import unittest
import logging
from unittest.mock import patch, call
from test.integration.job_type_test import JobTypeTest
from utils.object import Object

from workers.default.xml.xml_generator import generate_xml
from workers.default.xml.xml_validator import validate_xml


class IngestJournalTest(unittest.TestCase):

    resource_dir = os.environ['TEST_RESOURCE_DIR']

    def setUp(self):
        self.schema_file = 'resources/' + 'mets.xsd'
        self.target_file_path = ''
        self.logger = logging.getLogger('workers.default.xml.xml_validator')

    def tearDown(self):
        pass
       # os.remove(self.target_file_path)

    def test_journal_xml_create(self):
        """
        Test XML generation and validation with example template for OJS-Import.
        """
        # SetUp
        obj = Object(f'{self.resource_dir}/objects/a_journal')
        template_file = 'mets_template_journal.xml'
        self.target_file_path = os.path.join(obj.path, 'test_ojsxml.xml')

        params = {
            'template_file': 'mets_template_journal.xml',
            'target_filename': 'mets.xml',
            'schema_file': 'mets.xsd',
            'job_id': '5b7ab852-887b-11ea-b351-0242ac170008',
            'work_path': '5b79b2ec-887b-11ea-af07-0242ac170008',
            'parent_job_id': '5b79b2ec-887b-11ea-af07-0242ac170008',
            'object_id': 'JOURNAL-ZID001149881_1353296',
            'pdf_base64': ''
            }

        # 1st. check creation
        generate_xml(obj, template_file, self.target_file_path, params)
        self.assertTrue(os.path.isfile(self.target_file_path))

        # 2nd. check validation
        with patch.object(self.logger, 'info') as mock_log:
            validate_xml(self.target_file_path,
                         schema_file_path=self.schema_file)
            mock_log.assert_has_calls(
                [call("XML Syntax-Check OK!"), call("XSD Schema Validation OK!")])


    def test_monography_xml_create(self):
        """
        Test XML generation and validation with example template for OMP-Import.
        """
        # SetUp
        obj = Object(f'{self.resource_dir}/objects/a_omp_book')
        template_file = 'mets_template_monography.xml'
        self.target_file_path = os.path.join(obj.path, 'test_ompxml.xml')

        params = {}
        
        # 1st. check creation
        generate_xml(obj, template_file, self.target_file_path, params)
        self.assertTrue(os.path.isfile(self.target_file_path))
        
        # 2nd. check validation
        with patch.object(self.logger, 'info') as mock_log:
            validate_xml(self.target_file_path, schema_file_path=self.schema_file)
            mock_log.assert_has_calls([call("XML Syntax-Check OK!"), call("XSD Schema Validation OK!")])

