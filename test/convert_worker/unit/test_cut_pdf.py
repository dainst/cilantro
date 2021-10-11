import os
import logging

from test.convert_worker.unit.convert_test import ConvertTest
from workers.convert.convert_pdf import split_merge_pdf
from utils.object import Object

log = logging.getLogger(__name__)


class CutPdfTest(ConvertTest):

    def test_cut_pdf(self):
        """Test cutting PDF into multiple files by page numbers."""
        pdf_src = f'{self.resource_dir}/files/test.pdf'
        file_generated = f'{self.working_dir}/data/pdf/merged.pdf'

        obj = Object(self.working_dir)
        params = [{"file": "test.pdf", "range": [1, 20]},
                  {"file": "test.pdf", "range": [21, 27]}]

        with open(pdf_src, 'rb') as stream:
            obj.add_stream('test.pdf', 'pdf', stream)

        split_merge_pdf(params, obj.get_representation_dir('pdf'))
        self.assertTrue(os.path.isfile(file_generated))
