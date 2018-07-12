import unittest
import os
import json
import logging
import shutil

from workers.default.xml.xml_generator import generate_xml
from workers.default.xml.marc_xml_generator import generate_marc_xml

log = logging.getLogger(__name__)


class GenerateXMLTest(unittest.TestCase):

        resource_dir = os.environ['RESOURCE_DIR']
        working_dir = os.environ['WORKING_DIR']

        generated_filename1 = f'{working_dir}/articles/Ein_kleines_Musterdokument_mit_zweizeiligem_Titel/marc.xml'
        generated_filename2 = f'{working_dir}/articles/Titel_2/marc.xml'
        generated_filename3 = f'{working_dir}/ojs_import.xml'

        def test_generate_marcxml(self):
            data_path = f'{self.resource_dir}/objects/params/a_journal.json'
            with open(data_path) as json_object:
                data = json.load(json_object)

            template_file = open('resources/marc_template.xml', 'r')
            template_string = template_file.read()
            template_file.close()

            generate_marc_xml(self.working_dir, data, template_string)

            self.assertTrue(os.path.isfile(self.generated_filename1))
            self.assertTrue(os.path.isfile(self.generated_filename2))

            shutil.rmtree(f'{self.working_dir}/articles')

        def test_generate_ojsxml(self):
            data_path = f'{self.resource_dir}/objects/pdf/data_json/data.json'
            with open(data_path) as json_object:
                data = json.load(json_object)

            template_file = open('resources/ojs_template.xml', 'r')
            template_string = template_file.read()
            template_file.close()

            generate_xml(self.working_dir, data, template_string)

            self.assertTrue(os.path.isfile(self.generated_filename3))

            try:
                os.remove(self.generated_filename3)
                log.debug("Deleted file: " + self.generated_filename3)
            except FileNotFoundError as e:
                log.error("File not found: " + e.filename)
