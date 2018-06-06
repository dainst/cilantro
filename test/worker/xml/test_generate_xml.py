import unittest
import os
import json

from worker.xml.xml_generator import generate_xml


class GenerateXMLTest(unittest.TestCase):

        resource_dir = os.environ['RESOURCE_DIR']
        working_dir = os.environ['WORKING_DIR']

        generated_filename1 = f'{working_dir}/Ein_kleines_Musterdokument_mit_zweizeiligem_Titel.xml'
        generated_filename2 = f'{working_dir}/Titel_2.xml'
        generated_filename3 = f'{working_dir}/ojs_import.xml'

        def test_generate_marcxml(self):
            data_path = f'{self.resource_dir}/objects/pdf/data_json/data.json'
            with open(data_path) as json_object:
                data = json.load(json_object)

            generate_xml(self.working_dir, data, 'marc')

            self.assertTrue(os.path.isfile(self.generated_filename1))
            self.assertTrue(os.path.isfile(self.generated_filename2))

        def test_generate_ojsxml(self):
            data_path = f'{self.resource_dir}/objects/pdf/data_json/data.json'
            with open(data_path) as json_object:
                data = json.load(json_object)

            generate_xml(self.working_dir, data, 'ojs')

            self.assertTrue(os.path.isfile(self.generated_filename3))

        def tearDown(self):
            try:
                os.remove(self.generated_filename1)
                os.remove(self.generated_filename2)
                os.remove(self.generated_filename3)
            except FileNotFoundError:
                pass
