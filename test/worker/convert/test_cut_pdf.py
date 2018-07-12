import shutil
import os
import logging

from test.worker.convert.convert_test import ConvertTest
from workers.convert.image_pdf.convert_pdf import add_split_pdf_to_object
from utils.object import Object

log = logging.getLogger(__name__)


class CutPdfTest(ConvertTest):

    def setUp(self):
        super().setUp()

        self.pdf_src = f'{self.resource_dir}/files/test.pdf'
        self.files_generated = [
            f'{self.working_dir}/test.pdf',
            f'{self.working_dir}/test.pdf.0.pdf',
            f'{self.working_dir}/test.pdf.1.pdf'
        ]

        shutil.copy(self.pdf_src, self.files_generated[0])

    def test_success(self):
        params = [
            {"file": "test.pdf", "range": [1, 20]},
            {"file": "test.pdf", "range": [21, 27]}
        ]
        cut_pdf(params, self.working_dir, self.working_dir)
        for file_generated in self.files_generated:
            self.assertTrue(os.path.isfile(file_generated))
