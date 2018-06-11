import logging
from PIL import Image
import PyPDF2


def convert_tif2jpg(source_file, target_file):
    if source_file != target_file:
        logging.getLogger(__name__).debug(f"Converting {source_file} "
                                          f"to {target_file}")
        Image.open(source_file).save(target_file)


def convert_pdf2txts(source_file, output_dir):
    with open(source_file, "rb") as input_stream:
        pdf = PyPDF2.PdfFileReader(input_stream)

        for index in range(0, pdf.getNumPages()):
            output = open('%s%d.txt' % (output_dir, index), 'wb')
            output.write(pdf.getPage(index).extractText().encode('utf-8'))
            output.close()
