import logging

from PIL import Image, ImageSequence
from wand.image import Image as Img

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


def convert_pdf2tiffs(source_file, output_dir, compression_quality=80):
    logging.getLogger(__name__).debug(f"Creating tiff files from {source_file} "
                                      f"to {output_dir}")
    try:
        with Img(filename=source_file, resolution=200) as img:
            img.save(filename=output_dir + f"0.tiff")
            pages = len(img.sequence)
            for i in range(pages):
                Img(img.sequence[i]).save(filename=output_dir + f"{i}.tiff")
    except Exception as e:
        raise e
