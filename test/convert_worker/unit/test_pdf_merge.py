import os
import logging

from test.convert_worker.unit.convert_test import ConvertTest
from workers.convert.convert_pdf import merge_pdf, split_merge_pdf
from utils.object import Object

import PyPDF2

log = logging.getLogger(__name__)


class PDFMergeTest(ConvertTest):

    def test_merge(self):
        """Test basic PDF merging"""
        pdf_src = f'{self.resource_dir}/files/test.pdf'
        file_generated = f'{self.working_dir}/data/pdf/merged.pdf'

        times = 10 # we just concatinate the same pdf 10 times

        with open(pdf_src,'rb') as f:
            pdf = PyPDF2.PdfFileReader(f)
            original_page_count = pdf.getNumPages()

        obj = Object(self.working_dir)
        params = ["test.pdf"] * times

        with open(pdf_src, 'rb') as stream:
            obj.add_stream('test.pdf', 'pdf', stream)

        merge_pdf(params, obj.get_representation_dir('pdf'))
        self.assertTrue(os.path.isfile(file_generated))

        with open(file_generated,'rb') as f:
            pdf = PyPDF2.PdfFileReader(f)
            merged_page_count = pdf.getNumPages()

        self.assertEqual(original_page_count * times, merged_page_count)

    def test_downscaling_if_above_threshold(self):
        """Reduce DPI if merged pdf size is above the given size threshold."""
        pdf_src = f'{self.resource_dir}/files/test.pdf'
        file_generated = f'{self.working_dir}/data/pdf/merged.pdf'

        obj = Object(self.working_dir)

        params = ["test.pdf", "test.pdf"]

        with open(pdf_src, 'rb') as stream:
            obj.add_stream('test.pdf', 'pdf', stream)
    
        merge_pdf(params, obj.get_representation_dir('pdf'))
        self.assertTrue(os.path.isfile(file_generated))

        processed_size_unoptimized = os.path.getsize(file_generated)

        with open(file_generated,'rb') as f:
            pdf = PyPDF2.PdfFileReader(f)
            processed_page_count_unoptimized = pdf.getNumPages()

        max_pdf_size = 0.4

        with open(pdf_src, 'rb') as stream:
            obj.add_stream('test.pdf', 'pdf', stream)
    
        merge_pdf(params, obj.get_representation_dir('pdf'), downscale_threshold_in_mb=max_pdf_size)
        self.assertTrue(os.path.isfile(file_generated))

        processed_size_optimized = os.path.getsize(file_generated)

        with open(file_generated,'rb') as f:
            pdf = PyPDF2.PdfFileReader(f)
            processed_page_count_optimized = pdf.getNumPages()

        self.assertGreater(processed_size_unoptimized, processed_size_optimized)
        self.assertEqual(processed_page_count_unoptimized, processed_page_count_optimized)

