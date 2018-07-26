import logging

from PIL import Image as PilImage


def convert_tif_to_jpg(source_file, target_file):
    if source_file != target_file:
        logging.getLogger(__name__).debug(f"Converting {source_file} "
                                          f"to {target_file}")
        PilImage.open(source_file).save(target_file)