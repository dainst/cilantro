import logging
import os
import subprocess

from PIL import Image as PilImage
import ocrmypdf
import pyocr

log = logging.getLogger(__name__)

tools = pyocr.get_available_tools()
if len(tools) == 0:
    log.error("No OCR tool found")

ocr_tool = tools[0]
log.debug("Will use ocr-tool: " + ocr_tool.get_name())

ocr_langs = ocr_tool.get_available_languages()
log.debug("Available languages: %s" % ", ".join(ocr_langs))

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


def tif_to_pdf(source_file, target_file, ocr_lang=None):
    """
    Make a 1 Paged PDF Document from a tif file.

    :param str source_file: path to the jpg
    :param str target_file: desired output path
    :param ocr_lang: the language used for ocr
    """
    scale = (900, 1200)

    if ocr_lang == None:
        image = PilImage.open(source_file)
        image.thumbnail(scale)
        image.save(target_file, 'PDF', resolution=100.0)
    else:
        try:
            ocrmypdf.ocr(source_file, target_file, language=ocr_lang, use_threads=True, optimize=3, jobs=1)
        except ocrmypdf.exceptions.DpiError:
            log.error(f'Low dpi image #{source_file}, skipping PDF OCR.')

            image = PilImage.open(source_file)
            image.thumbnail(scale)
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
    if language not in ocr_langs:
        log.error(f'language {language} not available. Defaulting to English.')
        lang = 'eng'
    else:
        lang = language
    log.debug("Will use lang '%s'" % lang)

    txt = ocr_tool.image_to_string(
        PilImage.open(source_file),
        lang=lang,
        builder=pyocr.builders.TextBuilder())

    with open(target_file, 'w') as outfile:
        outfile.write(txt)
