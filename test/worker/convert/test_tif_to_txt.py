import os
import unittest

from test.worker.convert.convert_test import ConvertTest
from workers.convert.tif_to_txt import tif_to_txt


class GenerateTextFromTif(ConvertTest):
    tif_path = f'{ConvertTest.resource_dir}/files/test.tif'
    target_file_path = f'{ConvertTest.working_dir}/test.converted.txt'

    def test_tif_to_txt(self):
        tif_to_txt(self.tif_path, self.target_file_path)

        self.assertTrue(os.path.isfile(self.target_file_path))

        with open(self.target_file_path, 'r') as file:
            result_txt = file.read()

        self.assertEqual(result_txt,
                         "When you're about to ﬁght the\n"
                         "Persians but you remember\n"
                         "that you left the oven on")

    def test_tif_to_txt_wrong_language(self):
        tif_to_txt(self.tif_path, self.target_file_path, language='equ')

        self.assertTrue(os.path.isfile(self.target_file_path))

        with open(self.target_file_path, 'r') as file:
            result_txt = file.read()

        self.assertNotEqual(result_txt,
                            "When you're about to ﬁght the\n"
                            "Persians but you remember\n"
                            "that you left the oven on")
