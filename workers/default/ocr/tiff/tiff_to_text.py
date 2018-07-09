import logging

from PIL import Image
import pyocr

log = logging.getLogger(__name__)


def tiff_to_text(image_path, language='eng'):
    """
    Extract text from tiff file via OCR

    Availabe languages can be found here:
    https://github.com/tesseract-ocr/tesseract/blob/master/doc/tesseract.1.asc#languages
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
        Image.open(image_path),
        lang=lang,
        builder=pyocr.builders.TextBuilder()
    )

    return txt
