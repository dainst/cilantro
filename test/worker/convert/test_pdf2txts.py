import os
import unittest
from pathlib import Path
from worker.convert.converter import convert_pdf_to_txts


class Pdf2TxtsTest(unittest.TestCase):
    pdf_path = 'test/resources/objects/pdf/e2e-testing.pdf'
    txt_path = 'test/resources/objects/pdf/{}.txt'

    def tearDown(self):
        for i in range(0, 27):
            try:
                os.remove(self.txt_path.format(i))
            except FileNotFoundError:
                pass

    def test_success(self):
        convert_pdf_to_txts(self.pdf_path, 'test/resources/objects/pdf/')
        p = self.txt_path.format(0)
        self.assertTrue(Path(p).is_file())
        stat = os.stat(p)
        self.assertGreater(stat.st_size, 0)
