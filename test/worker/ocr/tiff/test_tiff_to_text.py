import unittest
import os

from workers.default.ocr.tiff.tiff_to_text import tiff_to_text


class GenerateTextFromTiff(unittest.TestCase):

    def test_tiff_to_text(self):
        resource_dir = os.environ['RESOURCE_DIR']
        tiff_path = f'{resource_dir}/files/test.tif'

        result_txt = tiff_to_text(tiff_path)

        self.assertEqual(result_txt,
                         "When you're about to ﬁght the\n"
                         "Persians but you remember\n"
                         "that you left the oven on")
