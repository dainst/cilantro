import logging

from PIL import Image as PilImage
from wand.image import Image as WandImage
import pdftotext


def convert_tif_to_jpg(source_file, target_file):
    if source_file != target_file:
        logging.getLogger(__name__).debug(f"Converting {source_file} "
                                          f"to {target_file}")
        PilImage.open(source_file).save(target_file)


def convert_pdf_to_txt(source_file, output_dir):
    logging.getLogger(__name__).debug(f"Creating txt files from {source_file} "
                                      f"to {output_dir}")
    with open(source_file, "rb") as input_stream:
        pdf = pdftotext.PDF(input_stream)
        index = 0  # Needed as pdftotext is not a Python list with .index() capability.
        for page in pdf:
            output = open('%s%d.txt' % (output_dir, index), 'wb')
            output.write(page.encode('utf-8'))
            output.close()
            index = index + 1


def convert_pdf_to_tif(source_file, output_dir):
    logging.getLogger(__name__).debug(f"Creating tif files from {source_file} "
                                      f"to {output_dir}")
    try:
        with WandImage(filename=source_file, resolution=200) as img:
            pages = len(img.sequence)
            for i in range(pages):
                WandImage(img.sequence[i]).save(filename=output_dir + f"/{i}.tif")
    except Exception as e:
        raise e
