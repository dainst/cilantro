import logging
import os

from jinja2 import Template

log = logging.getLogger(__name__)


def generate_xml(work_path, data, template_string, target_filename='ojs_import.xml'):
    """
    Builds Jinja2 template and writes it to target file.

    :param str work_path: Path to put the generated XML
    :param dict data: Journal metadata
    :param str template_string: XML template
    :param str target_filename: self explanatory...
    :return: None
    """
    template = Template(template_string, trim_blocks=True, lstrip_blocks=True)
    filled_template = template.render(data)
    _write_xml_to_file(filled_template, work_path, target_filename)


def _write_xml_to_file(template, target_path, target_file_name):
    log.debug("Saving XML file to" + os.path.join(target_path, target_file_name))
    text_file = open(os.path.join(target_path, target_file_name), "w")
    text_file.write(str(template))
    text_file.close()
