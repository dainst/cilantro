import os
import shutil

from pathlib import Path

from test.worker.convert.convert_test import ConvertTest
from workers.convert.convert_image_pdf import convert_pdf_to_tif


class PdfToTifTest(ConvertTest):

    def setUp(self):
        super().setUp()
        self.pdf_src = f'{self.resource_dir}/files/test_small.pdf'
        self.pdf_path = f'{self.working_dir}/test.pdf'
        self.tif_path = '{}/{}.tif'
        shutil.copy(self.pdf_src, self.pdf_path)

    def test_success(self):
        convert_pdf_to_tif(self.pdf_path, self.working_dir)
        tif_0_path = self.tif_path.format(self.working_dir, 0)
        self.assertTrue(Path(tif_0_path).is_file())
        stat = os.stat(tif_0_path)
        self.assertGreater(stat.st_size, 0)
