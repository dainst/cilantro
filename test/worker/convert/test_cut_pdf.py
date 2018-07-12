import shutil
import os
import logging

from test.worker.convert.convert_test import ConvertTest
from workers.convert.image_pdf.convert_pdf import add_split_pdf_to_object
from utils.object import Object


log = logging.getLogger(__name__)


class CutPdfTest(ConvertTest):
    resource_dir = os.environ['RESOURCE_DIR']
    working_dir = os.path.join(os.environ['WORKING_DIR'], 'cut_test')
    pdf_src = f'{resource_dir}/objects/pdf/e2e-testing.pdf'
    files_generated = [
        f'{working_dir}/e2e-testing.pdf',
        f'{working_dir}/data/pdf/merged.pdf'
    ]
    source_path = working_dir
    target_path = source_path

    def setUp(self):
        if not os.path.exists(self.working_dir):
            os.makedirs(self.working_dir)
        shutil.copy(self.pdf_src, self.files_generated[0])

    def test_success(self):
        params = [{"file": "e2e-testing.pdf", "range": [1, 20]},
                  {"file": "e2e-testing.pdf", "range": [21, 27]}]
        obj = Object(self.target_path)
        add_split_pdf_to_object(params, self.source_path, obj)
        for file_generated in self.files_generated:
            self.assertTrue(os.path.isfile(file_generated))
