import os
import logging

from test.worker.convert.convert_test import ConvertTest

from workers.convert.convert_pdf import split_pdf
from utils.object import Object

log = logging.getLogger(__name__)


class CutPdfTest(ConvertTest):
    resource_dir = os.environ['RESOURCE_DIR']
    working_dir = os.path.join(os.environ['WORKING_DIR'], 'cut_test')
    pdf_src = f'{resource_dir}/objects/pdf/e2e-testing.pdf'
    file_generated = f'{working_dir}/data/pdf/merged.pdf'

    def test_success(self):
        params = [{"file": "e2e-testing.pdf", "range": [1, 20]},
                  {"file": "e2e-testing.pdf", "range": [21, 27]}]
        obj = Object(self.working_dir)
        stream = open(self.pdf_src, 'rb')
        obj.add_file('e2e-testing.pdf', 'pdf', stream)
        stream.close()
        split_pdf(params, obj.get_representation_dir('pdf'))
        self.assertTrue(os.path.isfile(self.file_generated))
