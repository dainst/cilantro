import logging

from PIL import Image
import pdftotext


def convert_tif_to_jpg(source_file, target_file):
    if source_file != target_file:
        logging.getLogger(__name__).debug(f"Converting {source_file} "
                                          f"to {target_file}")
        Image.open(source_file).save(target_file)


def convert_pdf2txts(source_file, output_dir):
    logging.getLogger(__name__).debug(f"Creating txt files from {source_file} "
                                      f"to {output_dir}")
    with open(source_file, "rb") as input_stream:
        pdf = pdftotext.PDF(input_stream)
        index = 0
        for page in pdf:
            try:
                output = open('%s%d.txt' % (output_dir, index), 'wb')
                output.write(page.encode('utf-8'))
            finally:
                output.close()
            index = index + 1
