import os
import shutil

from pathlib import Path

from test.worker.convert.convert_test import ConvertTest
from workers.convert.convert_pdf import convert_pdf_to_tif


class PdfToTifTest(ConvertTest):

    def setUp(self):
        super().setUp()
        self.pdf_src = os.path.join(f'{self.resource_dir}', 'files', 'test_small.pdf')
        self.pdf_path = os.path.join(f'{self.working_dir}', 'test.pdf')
        shutil.copy(self.pdf_src, self.pdf_path)

    def test_success(self):
        convert_pdf_to_tif(self.pdf_path, self.working_dir)
        name = os.path.splitext(os.path.basename(self.pdf_path))[0]
        tif_0_path = os.path.join(self.working_dir, f'{name}_0000.tif')
        self.assertTrue(Path(tif_0_path).is_file())
        stat = os.stat(tif_0_path)
        self.assertGreater(stat.st_size, 0)
