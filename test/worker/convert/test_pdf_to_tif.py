import os
import shutil

import unittest
from pathlib import Path

from workers.convert.image_pdf.convert_image_pdf import convert_pdf_to_tif


class PdfToTifTest(unittest.TestCase):
    resource_dir = os.environ['RESOURCE_DIR']
    working_dir = os.environ['WORKING_DIR']
    pdf_src = f'{resource_dir}/files/test_small.pdf'
    pdf_path = f'{working_dir}/test.pdf'
    tif_path = '{}/{}.tif'

    def setUp(self):
        shutil.copy(self.pdf_src, self.pdf_path)

    def tearDown(self):
        for i in range(0, 27):
            try:
                os.remove(self.tif_path.format(self.working_dir, i))
            except FileNotFoundError:
                pass

    def test_success(self):
        convert_pdf_to_tif(self.pdf_path, self.working_dir)
        tif_0_path = self.tif_path.format(self.working_dir, 0)
        self.assertTrue(Path(tif_0_path).is_file())
        stat = os.stat(tif_0_path)
        self.assertGreater(stat.st_size, 0)
