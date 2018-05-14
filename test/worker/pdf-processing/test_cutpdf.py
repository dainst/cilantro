import json
import shutil
import os
import unittest
from worker.pdf.pdf_processor import cut_pdf


class PdfProcessTest(unittest.TestCase):

    resource_dir = os.environ['RESOURCE_DIR']
    working_dir = os.environ['WORKING_DIR']
    pdf_src = f'{resource_dir}/objects/pdf/e2e-testing.pdf'
    files_generated = [
        f'{working_dir}/e2e-testing.pdf',
        f'{working_dir}/e2e-testing.pdf.0.pdf',
        f'{working_dir}/e2e-testing.pdf.1.pdf'
    ]
    source = working_dir
    target = source

    def setUp(self):
        shutil.copy(self.pdf_src, self.files_generated[0])

    def test_success_no_attachment(self):
        json_path = f'{self.resource_dir}/objects/pdf/data_json/data.json'
        with open(json_path) as data_object:
            data = json.load(data_object)
        cut_pdf(data, self.source, self.target)
        for f in self.files_generated:
            self.assertTrue(os.path.isfile(f))

    def test_success_attachment(self):
        json_path = f'{self.resource_dir}/objects/pdf/data_json/data_attached.json'
        with open(json_path) as data_object:
            data = json.load(data_object)
        cut_pdf(data, self.source, self.target)
        for f in self.files_generated:
            self.assertTrue(os.path.isfile(f))

    def tearDown(self):
        for f in self.files_generated:
            try:
                os.remove(f)
            except FileNotFoundError:
                pass
