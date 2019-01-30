import logging
import os
import datetime
import glob

from jinja2 import Environment, FileSystemLoader

log = logging.getLogger(__name__)


def generate_xml(obj, template_file, target_filepath, additional_params):
    """
    Build Jinja2 template and write it to target file.

    :param Object obj: The Cilantro Object to be used in the template
    :param str template_file: name of the template file to be used
    :param str target_filepath: name of the generated XML file
    :param dict additional_params: ojs_metadata
    :return str: Path to generated XML file
    """
    env = Environment(
        loader=FileSystemLoader('resources'),
        trim_blocks=True,
        lstrip_blocks=True)
    # Some functions which may be needed in the template (logic)
    env.globals['path_join'] = os.path.join
    env.globals['datetime'] = datetime.datetime
    env.globals['glob'] = glob.glob

    log.info("Generating XML with template: " + template_file)

    template = env.get_template(template_file)
    filled_template = template.render(obj=obj,
                                      additional_params={'additional_params':
                                                         additional_params,
                                                         'os.environ':
                                                         os.environ})

    _write_xml_to_file(filled_template, target_filepath)
    return os.path.join(target_filepath)


def _write_xml_to_file(template, target_filepath):
    log.debug("Saving XML file to" + os.path.join(target_filepath))
    with open(target_filepath, "w") as text_file:
        text_file.write(str(template))
