import os

from test.worker.convert.convert_test import ConvertTest
from workers.convert.image_pdf.convert_image_pdf import convert_jpg_to_pdf


class Jpg2PdfTest(ConvertTest):

    def setUp(self):
        super().setUp()
        self.jpg_0_src = f'{self.resource_dir}/files/test.jpg'
        self.generated_file = f'{self.working_dir}/test.pdf'

    def test_success(self):
        convert_jpg_to_pdf(self.jpg_0_src, self.generated_file)
        self.assertTrue(os.path.isfile(self.generated_file))
        stat = os.stat(self.generated_file)
        self.assertGreater(stat.st_size, 0)
