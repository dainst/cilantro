import os
import logging

from test.unit.worker.convert.convert_test import ConvertTest
from workers.convert.convert_pdf import split_merge_pdf
from utils.object import Object

log = logging.getLogger(__name__)


class AutomaticPDFDownscalingTest(ConvertTest):

    def test_no_downscaling_if_below_threshold(self):
        """Do not apply additional scaling if pdf is below the given size threshold."""
        pdf_src = f'{self.resource_dir}/files/test.pdf'
        file_generated = f'{self.working_dir}/data/pdf/merged.pdf'

        max_pdf_size = 0.4

        obj = Object(self.working_dir)
        params = [{"file": "test.pdf", "range": [1, 20]},
                  {"file": "test.pdf", "range": [21, 27]}]

        with open(pdf_src, 'rb') as stream:
            obj.add_stream('test.pdf', 'pdf', stream)

        split_merge_pdf(params, obj.get_representation_dir('pdf'), max_size_in_mb=100)
        self.assertTrue(os.path.isfile(file_generated))
        self.assertTrue(os.path.getsize(file_generated) * 0.000001 > max_pdf_size)


    def test_downscaling_if_above_threshold(self):
        """Apply additional scaling if pdf is above the given size threshold."""
        pdf_src = f'{self.resource_dir}/files/test.pdf'
        file_generated = f'{self.working_dir}/data/pdf/merged.pdf'

        max_pdf_size = 0.4

        obj = Object(self.working_dir)
        params = [{"file": "test.pdf", "range": [1, 20]},
                  {"file": "test.pdf", "range": [21, 27]}]

        with open(pdf_src, 'rb') as stream:
            obj.add_stream('test.pdf', 'pdf', stream)

        split_merge_pdf(params, obj.get_representation_dir('pdf'), max_size_in_mb=max_pdf_size)
        self.assertTrue(os.path.isfile(file_generated))
        self.assertTrue(os.path.getsize(file_generated) * 0.000001 < max_pdf_size)

