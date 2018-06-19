import os
import unittest
from pathlib import Path

from workers.convert.image.converter import convert_pdf_to_txt


class PdfToTxtTest(unittest.TestCase):

    pdf_path = 'test/resources/objects/pdf/e2e-testing.pdf'
    txt_path = 'test/resources/objects/pdf/{}.txt'

    def tearDown(self):
        for i in range(0, 27):
            try:
                os.remove(self.txt_path.format(i))
            except FileNotFoundError:
                pass

    def test_success(self):
        convert_pdf_to_txt(self.pdf_path, 'test/resources/objects/pdf/')
        txt_0_path = self.txt_path.format(0)
        self.assertTrue(Path(txt_0_path).is_file())
        stat = os.stat(txt_0_path)
        self.assertGreater(stat.st_size, 0)
        try:
            file = open(txt_0_path, 'r')
            self.assertIn("TECHNISCHE UNIVERSITÄT CAROLO-WILHELMINA ZU BRAUNSCHWEIG", file.read())
        finally:
            file.close()
