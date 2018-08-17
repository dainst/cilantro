import os
import logging

from test.worker.convert.convert_test import ConvertTest

from workers.convert.convert_pdf import split_merge_pdf
from utils.object import Object

log = logging.getLogger(__name__)


class CutPdfTest(ConvertTest):
    resource_dir = os.environ['RESOURCE_DIR']
    working_dir = os.path.join(os.environ['WORKING_DIR'], 'cut_test')
    pdf_src = f'{resource_dir}/files/test.pdf'
    file_generated = f'{working_dir}/data/pdf/merged.pdf'

    def test_success(self):
        obj = Object(self.working_dir)
        params = [{"file": f"{obj.get_representation_dir('pdf')}/test.pdf", "range": [1, 20]},
                  {"file": f"{obj.get_representation_dir('pdf')}/test.pdf", "range": [21, 27]}]
        stream = open(self.pdf_src, 'rb')
        obj.add_stream('test.pdf', 'pdf', stream)
        stream.close()
        split_merge_pdf(params, obj.get_representation_dir('pdf'))
        self.assertTrue(os.path.isfile(self.file_generated))
