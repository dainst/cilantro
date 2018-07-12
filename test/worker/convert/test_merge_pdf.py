import os

from workers.convert.image_pdf.convert_pdf import pdf_merge
from test.worker.convert.convert_test import ConvertTest


class MergePdfTest(ConvertTest):

    def setUp(self):
        super().setUp()
        self.pdf_1 = f'{self.resource_dir}/files/test.pdf'
        self.pdf_2 = f'{self.resource_dir}/files/test.pdf'
        self.generated_file = f'{self.working_dir}/merged.pdf'

    def test_success(self):
        pdf_merge([self.pdf_1, self.pdf_2], self.generated_file)
        self.assertTrue(os.path.isfile(self.generated_file))
        stat = os.stat(self.generated_file)
        self.assertGreater(stat.st_size, 0)
