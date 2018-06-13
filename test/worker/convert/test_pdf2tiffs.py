import os
import unittest
from pathlib import Path
from worker.convert.converter import convert_pdf2tiffs


class Pdf2TiffsTest(unittest.TestCase):
    pdf_path = 'test/resources/objects/pdf/e2e-testing.pdf'
    tiff_path = 'test/resources/objects/pdf/{}.tiff'

    def tearDown(self):
        for i in range(0, 27):
            try:
                os.remove(self.tiff_path.format(i))
            except FileNotFoundError:
                pass

    def test_success(self):
        convert_pdf2tiffs(self.pdf_path, 'test/resources/objects/pdf/', 80)
        p = self.tiff_path.format(0)
        self.assertTrue(Path(p).is_file())
        stat = os.stat(p)
        self.assertGreater(stat.st_size, 0)
