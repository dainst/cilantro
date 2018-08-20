import logging
import os

from PIL import Image
from wand.image import Image as WandImage


def convert_pdf_to_tif(source_file, output_dir):
    """
    Create a TIF for every Page in the PDF and saves them to the output_dir.

    :param str source_file: path to the PDF
    :param str output_dir: path to the output Directory
    """
    logging.getLogger(__name__).debug(f"Creating tif files from {source_file} "
                                      f"to {output_dir}")
    try:
        with WandImage(filename=source_file, resolution=200) as img:
            pages = len(img.sequence)
            for i in range(pages):
                with WandImage(img.sequence[i]) as page_img:
                    page_img.type = 'truecolor'
                    name = os.path.splitext(os.path.basename(source_file))[0]
                    page_img.save(filename=output_dir + f"/{name}_{i}.tif")

    except Exception as e:
        raise e


def convert_jpg_to_pdf(source_file, target_file):
    """
    Make a 1 Paged PDF Document from a jpg file.

    :param str source_file: path to the jpg
    :param str target_file: desired output path
    """
    Image.open(source_file).save(target_file, 'PDF', resolution=100.0)
