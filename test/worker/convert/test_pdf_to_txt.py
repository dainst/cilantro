import os

from test.worker.convert.convert_test import ConvertTest
from workers.convert.convert_pdf import convert_pdf_to_txt


class PdfToTxtTest(ConvertTest):

    def setUp(self):
        super().setUp()
        self.txt_dir = os.path.join(self.working_dir, 'txt_from_pdf')
        self.pdf_path = f'{self.resource_dir}/files/test.pdf'
        self.pdf_pages = 27
        os.makedirs(self.txt_dir, exist_ok=True)

    def test_success(self):
        convert_pdf_to_txt(self.pdf_path, self.txt_dir)
        name = os.path.splitext(os.path.basename(self.pdf_path))[0]
        for page in range(1, self.pdf_pages + 1):
            file = os.path.join(self.txt_dir, f'{name}_{page}.txt')
            self.assertTrue(os.path.isfile(file))

        with open(os.path.join(self.txt_dir, f'{name}_1.txt')) as f:
            self.assertIn("TECHNISCHE UNIVERSITÄT CAROLO-WILHELMINA", f.read())
