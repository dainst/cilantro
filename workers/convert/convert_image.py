import logging
import os
import subprocess

from PIL import Image as PilImage
import pyocr

log = logging.getLogger(__name__)


def convert_tif_to_ptif(source_file, output_dir):
    """Transform the source TIFF file to PTIF via vips shell command."""
    new_filename = os.path.join(output_dir,
                                os.path.splitext(os.path.basename(
                                    source_file))[0] + '.ptif')

    shell_command = subprocess.run([
        "vips",
        "im_vips2tiff",
        source_file,
        f"{new_filename}:jpeg,tile:256x256,pyramid"
    ])

    if shell_command.returncode != 0:
        log.error("PTIF conversion failed")
        raise OSError(f"PTIF conversion failed")


def convert_tif_to_jpg(source_file, target_file):
    """
    Save the parameter source file and saves it as the target file.

    :param str source_file: path to the TIF source file
    :param str target_file: path to the generated output file
    """
    if source_file != target_file:
        logging.getLogger(__name__).debug(f"Converting {source_file} "
                                          f"to {target_file}")
        PilImage.open(source_file).convert('RGB').save(target_file)


def convert_jpg_to_pdf(source_file, target_file, max_size=(900, 1200)):
    """
    Make a 1 Paged PDF Document from a jpg file.

    :param str source_file: path to the jpg
    :param str target_file: desired output path
    :param tuple max_size: the maximum size in pixels of the resulting pdf
    """
    image = PilImage.open(source_file)
    image.thumbnail(max_size)
    image.save(target_file, 'PDF', resolution=100.0)


def tif_to_pdf(source_file, target_file, max_size=(900, 1200)):
    """
    Make a 1 Paged PDF Document from a tif file.

    :param str source_file: path to the jpg
    :param str target_file: desired output path
    :param tuple max_size: the maximum size in pixels of the resulting pdf
    """
    image = PilImage.open(source_file)
    image.thumbnail(max_size)
    image.save(target_file, 'PDF', resolution=100.0)


def tif_to_txt(source_file, target_file, language='eng'):
    """
    Extract text from tiff file via OCR and writes to target file.

    Availabe languages can be found here:
    https://github.com/tesseract-ocr/tesseract/blob/master/doc/tesseract.1.asc#languages

    :param str source_file: file path to tiff
    :param str target_file: name of generated text-file
    :param str language: used by tesseract. Possible values: see above.
    """
    tools = pyocr.get_available_tools()
    if len(tools) == 0:
        log.error("No OCR tool found")
        return
    # The tools are returned in the recommended order of usage
    tool = tools[0]
    log.debug("Will use ocr-tool: " + tool.get_name())

    langs = tool.get_available_languages()
    log.debug("Available languages: %s" % ", ".join(langs))
    if language not in langs:
        log.error(f'language {language} not available. Defaulting to English.')
        lang = 'eng'
    else:
        lang = language
    log.debug("Will use lang '%s'" % lang)

    txt = tool.image_to_string(
        PilImage.open(source_file),
        lang=lang,
        builder=pyocr.builders.TextBuilder())

    with open(target_file, 'w') as outfile:
        outfile.write(txt)
