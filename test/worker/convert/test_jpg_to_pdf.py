import os
import unittest

from workers.convert.convert_pdf import pdf_merge
from workers.convert.convert_image_pdf import convert_jpg_to_pdf


class Jpg2PdfTest(unittest.TestCase):
    resource_dir = os.environ['RESOURCE_DIR']
    working_dir = os.environ['WORKING_DIR']
    jpg_0_src = f'{resource_dir}/files/test.jpg'
    generated_file = f'{working_dir}/test.pdf'

    def test_success(self):
        convert_jpg_to_pdf(self.jpg_0_src, self.generated_file)
        self.assertTrue(os.path.isfile(self.generated_file))
        stat = os.stat(self.generated_file)
        self.assertGreater(stat.st_size, 0)

    def tearDown(self):
        try:
            os.remove(self.generated_file)
        except FileNotFoundError:
            pass


class MergeConvertedPdfTest(unittest.TestCase):
    resource_dir = os.environ['RESOURCE_DIR']
    working_dir = os.environ['WORKING_DIR']
    pdf_1 = f'{resource_dir}/files/test.pdf'
    pdf_2 = f'{resource_dir}/files/test.pdf'
    generated_file = f'{working_dir}/merged.pdf'

    def test_success(self):
        pdf_merge([self.pdf_1, self.pdf_2], self.generated_file)
        self.assertTrue(os.path.isfile(self.generated_file))
        stat = os.stat(self.generated_file)
        self.assertGreater(stat.st_size, 0)

    def tearDown(self):
        try:
            os.remove(self.generated_file)
        except FileNotFoundError:
            pass
