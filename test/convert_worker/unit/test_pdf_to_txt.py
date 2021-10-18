import os

from test.convert_worker.unit.convert_test import ConvertTest
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
        for page in range(0, self.pdf_pages):
            file = os.path.join(self.txt_dir, f'{name}_{"%04i"% page}.txt')
            self.assertTrue(os.path.isfile(file))

        with open(os.path.join(self.txt_dir, f'{name}_0000.txt')) as f:
            self.assertIn("TECHNISCHE UNIVERSITÄT CAROLO-WILHELMINA", f.read())
