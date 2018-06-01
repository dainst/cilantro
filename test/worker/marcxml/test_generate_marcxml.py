import unittest
import os
import json

from worker.marcxml.marcxml_generator import generate_marcxml


class GenerateMarcXMLTest(unittest.TestCase):

        resource_dir = os.environ['RESOURCE_DIR']
        working_dir = os.environ['WORKING_DIR']
        target_path = working_dir

        generated_filename1 = f'{target_path}/Ein_kleines_Musterdokument_mit_zweizeiligem_Titel.xml'
        generated_filename2 = f'{target_path}/Titel_2.xml'

        def test_generate_marcxml(self):
            data_path = f'{self.resource_dir}/objects/pdf/data_json/data.json'
            with open(data_path) as json_object:
                data = json.load(json_object)
            generate_marcxml(data, self.target_path)
            self.assertTrue(os.path.isfile(self.generated_filename1))
            self.assertTrue(os.path.isfile(self.generated_filename2))

        def tearDown(self):
            try:
                os.remove(self.generated_filename1)  # TODO redo
                os.remove(self.generated_filename2)
            except FileNotFoundError:
                pass
