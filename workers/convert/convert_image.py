import logging

from PIL import Image as PilImage


def convert_tif_to_jpg(source_file, target_file):
    """
    Save the parameter source file and saves it as the target file.

    :param str source_file: path to the TIF source file
    :param str output_dir: path to the generated output file
    """
    if source_file != target_file:
        logging.getLogger(__name__).debug(f"Converting {source_file} "
                                          f"to {target_file}")
        PilImage.open(source_file).save(target_file)
