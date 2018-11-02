import logging

from PIL import Image as PilImage


def scale_image(source_path, target_path, max_width, max_height):
    """
    Scale the image to the given size keeping aspect ratio.

    Open the given image and scales the size to the given values for
    width and height while keeping the aspect ratio.
    The new file will be named like the original one with the new size added
    with underscores.

    Tested working for JPEG and TIFF.

    :param str source_path: path to the image to be scaled
    :param str target_path: path to save the generated image to
    :param int max_width: maximum width in pixels of the generated image
    :param int max_height: maximum height in pixels of the generated image
    """
    logging.getLogger(__name__).debug(f"Resizing {source_path} "
                                      f"to size: {(max_width, max_height)}")

    # conversion is needed for tiffs
    image = PilImage.open(source_path).convert('RGB')
    image.thumbnail((max_width, max_height))
    image.save(target_path)
