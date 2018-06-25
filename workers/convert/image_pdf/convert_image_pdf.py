import logging

from PIL import Image
from wand.image import Image as WandImage


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


def convert_jpg_to_pdf(source_file, target_file):
    Image.open(source_file).save(target_file, 'PDF', resolution=100.0)
