import os

from test.worker.convert.convert_test import ConvertTest
from workers.convert.image_pdf.convert_pdf import convert_pdf_to_txt


class PdfToTxtTest(ConvertTest):

    def setUp(self):
        super().setUp()
        self.txt_dir = os.path.join(self.working_dir, 'txt_from_pdf')
        self.pdf_path = f'{self.resource_dir}/files/test.pdf'
        self.pdf_pages = 27
        os.makedirs(self.txt_dir, exist_ok=True)

    def test_success(self):
        convert_pdf_to_txt(self.pdf_path, self.txt_dir)

        for page in range(1, self.pdf_pages + 1):
            file = os.path.join(self.txt_dir, f'page.{page}.txt')
            if not os.path.isfile(file):
                raise Exception(f"File {file} does not exist or is a directory")

        with open(os.path.join(self.txt_dir, 'page.1.txt')) as f:
            self.assertIn("TECHNISCHE UNIVERSITÄT CAROLO-WILHELMINA", f.read())
