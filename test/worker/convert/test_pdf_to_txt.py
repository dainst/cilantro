import os
import shutil
import unittest

from workers.convert.image_pdf.convert_pdf import convert_pdf_to_txt


class PdfToTxtTest(unittest.TestCase):

    working_dir = os.environ['WORKING_DIR']
    txt_dir = os.path.join(working_dir, 'txt_from_pdf')

    pdf_path = 'test/resources/objects/pdf/e2e-testing.pdf'
    pdf_pages = 27

    def setUp(self):
        os.makedirs(self.txt_dir)

    def tearDown(self):
        shutil.rmtree(self.txt_dir)

    def test_success(self):
        convert_pdf_to_txt(self.pdf_path, self.txt_dir)

        for page in range(1, self.pdf_pages + 1):
            file = os.path.join(self.txt_dir, f'page.{page}.txt')
            if not os.path.isfile(file):
                raise Exception(f"File {file} does not exist or is a directory")

        with open(os.path.join(self.txt_dir, 'page.1.txt')) as f:
            self.assertIn("TECHNISCHE UNIVERSITÄT CAROLO-WILHELMINA", f.read())
