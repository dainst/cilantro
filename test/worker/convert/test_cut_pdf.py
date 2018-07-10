import shutil
import os
import unittest
import logging

from workers.convert.convert_pdf import cut_pdf

log = logging.getLogger(__name__)


class CutPdfTest(unittest.TestCase):
    resource_dir = os.environ['RESOURCE_DIR']
    working_dir = os.environ['WORKING_DIR']
    pdf_src = f'{resource_dir}/files/test.pdf'
    files_generated = [
        f'{working_dir}/test.pdf',
        f'{working_dir}/test.pdf.0.pdf',
        f'{working_dir}/test.pdf.1.pdf'
    ]
    source_path = working_dir
    target_path = source_path

    def setUp(self):
        shutil.copy(self.pdf_src, self.files_generated[0])

    def test_success(self):
        params = [{"file": "test.pdf", "range": [1, 20]}, {"file": "test.pdf", "range": [21, 27]}]
        cut_pdf(params, self.source_path, self.target_path)
        for file_generated in self.files_generated:
            self.assertTrue(os.path.isfile(file_generated))

    def tearDown(self):
        for file_generated in self.files_generated:
            try:
                os.remove(file_generated)
                log.debug("Deleted file: " + file_generated)
            except FileNotFoundError as e:
                log.error("File not found: " + e.filename)
