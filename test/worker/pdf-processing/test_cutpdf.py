import json
import shutil
import os
import unittest
from worker.pdf.pdf_processor import cut_pdf


class PdfProcessTest(unittest.TestCase):

    test_pdf_res = 'test/resources/objects/pdf/e2e-testing.pdf'
    test_pdf_work = 'data/workspace/e2e-testing.pdf'

    def setUp(self):
        try:
            shutil.copy(self.test_pdf_res, self.test_pdf_work)
        except:
            raise Exception(f'Copying {self.test_pdf_res} to {self.test_pdf_work} failed')

    def test_success_no_attachment(self):
        json_path = 'test/resources/objects/pdf/data_json/data.json'
        with open(json_path) as data_object:
            data = json.load(data_object)
        result = cut_pdf(data)
        self.assertTrue(result == 'success')

    def test_success_attachment(self):
        json_path = 'test/resources/objects/pdf/data_json/data_attached.json'
        with open(json_path) as data_object:
            data = json.load(data_object)
        result = cut_pdf(data)
        self.assertTrue(result == 'success')

    def tearDown(self):
        try:
            os.remove(self.test_pdf_work)
        except FileNotFoundError:
            pass
        except:
            raise Exception(f'Removing {self.test_pdf_work} failed')
