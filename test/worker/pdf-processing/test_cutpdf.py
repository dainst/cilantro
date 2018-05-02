import json
import unittest
from worker.pdf.pdf_processor import cut_pdf


class PdfProcessTest(unittest.TestCase):
    def test_success_no_attachment(self):
        json_path = 'test/resources/objects/data_json/data.json'
        with open(json_path) as data_object:
            data = json.load(data_object)
        result = cut_pdf(data)
        self.assertTrue(result == 'success')

    def test_success_attachment(self):
        json_path = 'test/resources/objects/data_json/data_attached.json'
        with open(json_path) as data_object:
            data = json.load(data_object)
        result = cut_pdf(data)
        self.assertTrue(result == 'success')