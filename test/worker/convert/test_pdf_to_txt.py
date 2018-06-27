import os
import unittest
from pathlib import Path

from workers.convert.image_pdf.convert_pdf import convert_pdf_to_txt


class PdfToTxtTest(unittest.TestCase):
    resource_dir = os.environ['RESOURCE_DIR']
    working_dir = os.environ['WORKING_DIR']
    pdf_path = f'{resource_dir}/files/test.pdf'
    txt_path = '{}/{}.txt'

    def tearDown(self):
        for i in range(0, 27):
            try:
                os.remove(self.txt_path.format(self.working_dir, i))
            except FileNotFoundError:
                pass

    def test_success(self):
        convert_pdf_to_txt(self.pdf_path, self.working_dir)
        txt_0_path = self.txt_path.format(self.working_dir, 0)
        self.assertTrue(Path(txt_0_path).is_file())
        stat = os.stat(txt_0_path)
        self.assertGreater(stat.st_size, 0)
        try:
            file = open(txt_0_path, 'r')
            self.assertIn("TECHNISCHE UNIVERSITÄT CAROLO-WILHELMINA ZU BRAUNSCHWEIG", file.read())
        finally:
            file.close()
