import json
import unittest
from worker.pdf.pdf_processor import cut_pdf


class PdfProcessTest(unittest.TestCase):
    def test_success(self):
        json_path = 'test/resources/objects/data_json/data.json'
        data = json.load(open(json_path))
        result = cut_pdf(data)
        self.assertTrue(result == 'success')