import logging
import os

from PIL import Image as PilImage


def scale_image(source, target_path, max_width, max_height, keep_ratio=True):
    """
    Scale the image to the given size.

    Opens the given image and scales the size to the given values for
    width and height while keeping the aspect ratio if selected so.
    The new file will be named like the original one with the new size added
    with underscores.

    Tested, working for JPEG and TIFF.

    :param str source: path to the image to be scaled, with filename
    :param str target_path: path without filename to save the generated image to
    :param int max_width: maximum width in pixels of the generated image
    :param int max_height: maximum height in pixels of the generated image
    :param bool keep_ratio: keeps the ratio of the generated image
    """
    logging.getLogger(__name__).debug(f"Resizing {source} "
                                      f"to size: {(max_width, max_height)}")

    # conversion is needed for tiffs
    image = PilImage.open(source).convert('RGB')

    if keep_ratio:
        image.thumbnail((max_width, max_height))
    else:
        image = image.resize((max_width, max_height))

    width, height = image.size
    file_name = os.path.splitext(os.path.basename(source))[0]
    file_extension = os.path.splitext(os.path.basename(source))[1]
    new_file_name = f"{file_name}_{width}_{height}{file_extension}"

    image.save(os.path.join(target_path, new_file_name))
