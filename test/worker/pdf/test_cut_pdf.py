import json
import shutil
import os
import unittest
import logging

from worker.pdf.pdf import cut_pdf


log = logging.getLogger(__name__)


class CutPdfTest(unittest.TestCase):

    resource_dir = os.environ['RESOURCE_DIR']
    working_dir = os.environ['WORKING_DIR']
    pdf_src = f'{resource_dir}/objects/pdf/e2e-testing.pdf'
    files_generated = [
        f'{working_dir}/e2e-testing.pdf',
        f'{working_dir}/e2e-testing.pdf.0.pdf',
        f'{working_dir}/e2e-testing.pdf.1.pdf'
    ]
    source_path = working_dir
    target_path = source_path

    @classmethod
    def setUpClass(cls):
        shutil.copy(cls.pdf_src, cls.files_generated[0])

    def test_success_no_attachment(self):
        json_path = f'{self.resource_dir}/objects/pdf/data_json/data.json'
        with open(json_path) as data_object:
            data = json.load(data_object)
        cut_pdf(data, self.source_path, self.target_path)
        for file_generated in self.files_generated:
            self.assertTrue(os.path.isfile(file_generated))

    def test_success_attachment(self):
        json_path = f'{self.resource_dir}/objects/pdf/data_json/data_attached.json'
        with open(json_path) as data_object:
            data = json.load(data_object)
        cut_pdf(data, self.source_path, self.target_path)
        for file_generated in self.files_generated:
            self.assertTrue(os.path.isfile(file_generated))

    @classmethod
    def tearDownClass(cls):
        for file_generated in cls.files_generated:
            try:
                os.remove(file_generated)
                log.debug("Deleted file: " + file_generated)
            except FileNotFoundError as e:
                log.error("File not found: " + e.filename)
