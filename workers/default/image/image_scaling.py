import logging
import os

from PIL import Image as PilImage


def scale_image(image_path, max_width, max_height, target_dir):
    """
    Scale the image to the given size keeping aspect ratio.

    Open the given image and scales the size to the given values for
    width and height while keeping the aspect ratio.
    The new file will be named like the original one with the new size added
    with underscores.

    Tested working for JPEG and TIFF.

    :param image_path: path to the image to be scaled
    :param max_width: maximum width in pixels of the generated image
    :param max_height: maximum height in pixels of the generated image
    :param target_dir: directory to save the generated image to
    """
    logging.getLogger(__name__).debug(f"Resizing {image_path} "
                                      f"to size: {(max_width, max_height)}")
    file_name = os.path.splitext(os.path.basename(image_path))[0]
    file_extension = os.path.splitext(os.path.basename(image_path))[1]
    new_file_name = file_name +\
        "_" + str(max_width) +\
        "_" + str(max_height) +\
        "." + file_extension

    # conversion is needed for tiffs
    image = PilImage.open(image_path).convert('RGB')
    image.thumbnail((max_width, max_height))
    image.save(os.path.join(target_dir, new_file_name))
