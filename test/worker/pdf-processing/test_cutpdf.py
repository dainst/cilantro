import json
import shutil
import os
import unittest
from worker.pdf.pdf_processor import cut_pdf


class PdfProcessTest(unittest.TestCase):

    test_pdf_res = 'test/resources/objects/pdf/e2e-testing.pdf'
    files_generated = [
        'data/workspace/e2e-testing.pdf',
        'data/workspace/e2e-testing.pdf.0.pdf',
        'data/workspace/e2e-testing.pdf.1.pdf'
    ]

    def setUp(self):
        try:
            shutil.copy(self.test_pdf_res, self.files_generated[0])
        except:
            raise Exception(f'Copying {self.test_pdf_res} to {self.files_generated[0]} failed')

    def test_success_no_attachment(self):
        json_path = 'test/resources/objects/pdf/data_json/data.json'
        with open(json_path) as data_object:
            data = json.load(data_object)
        cut_pdf(data)
        for f in self.files_generated:
            self.assertTrue(os.path.isfile(f))

    def test_success_attachment(self):
        json_path = 'test/resources/objects/pdf/data_json/data_attached.json'
        with open(json_path) as data_object:
            data = json.load(data_object)
        cut_pdf(data)
        for f in self.files_generated:
            self.assertTrue(os.path.isfile(f))

    # def tearDown(self):
    #     for f in self.files_generated:
    #         try:
    #             os.remove(f)
    #         except FileNotFoundError:
    #             pass
    #         except:
    #             raise Exception(f'Removing {f} failed')
