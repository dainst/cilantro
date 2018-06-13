import os
import shutil

import unittest
from pathlib import Path

from worker.convert.converter import convert_pdf_to_tifs


class Pdf2TifsTest(unittest.TestCase):
    resource_dir = os.environ['RESOURCE_DIR']
    working_dir = os.environ['WORKING_DIR']
    pdf_src = f'{resource_dir}/objects/pdf/e2e-testing.pdf'
    pdf_path = f'{working_dir}/e2e-testing.pdf'
    tif_path = '{}/{}.tif'

    @classmethod
    def setUpClass(cls):
        shutil.copy(cls.pdf_src, cls.pdf_path)

    def tearDown(self):
        for i in range(0, 27):
            try:
                os.remove(self.tif_path.format(self.working_dir, i))
            except FileNotFoundError:
                pass

    def test_success(self):
        convert_pdf_to_tifs(self.pdf_path, self.working_dir)
        p = self.tif_path.format(self.working_dir, 0)
        self.assertTrue(Path(p).is_file())
        stat = os.stat(p)
        self.assertGreater(stat.st_size, 0)
