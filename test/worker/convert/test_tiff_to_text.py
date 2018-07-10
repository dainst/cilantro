import unittest
import os

from workers.convert.tiff_to_text import tif_to_txt


class GenerateTextFromTiff(unittest.TestCase):

    def test_tiff_to_text(self):
        resource_dir = os.environ['RESOURCE_DIR']
        working_dir = os.environ['WORKING_DIR']
        tiff_path = f'{resource_dir}/files/test.tif'
        target_file_path = f'{working_dir}/test.converted.jpg'

        tif_to_txt(tiff_path, target_file_path)

        self.assertTrue(os.path.isfile(os.path.join(working_dir, target_file_path)))

        with open(target_file_path, 'r') as file:
            result_txt = file.read()

        self.assertEqual(result_txt,
                         "When you're about to ﬁght the\n"
                         "Persians but you remember\n"
                         "that you left the oven on")
