import os

from test.convert_worker.unit.convert_test import ConvertTest
from workers.convert.convert_image import tif_to_txt


class GenerateTextFromTif(ConvertTest):
    tif_path = f'{ConvertTest.resource_dir}/files/test.tif'
    target_file_path = f'{ConvertTest.working_dir}/test.converted.txt'

    def test_tif_to_txt(self):
        tif_to_txt(self.tif_path, self.target_file_path)

        self.assertTrue(os.path.isfile(self.target_file_path))

        with open(self.target_file_path, 'r') as file:
            result_txt = file.read()

        self.assertTrue("When you're about to fight the" in result_txt)
