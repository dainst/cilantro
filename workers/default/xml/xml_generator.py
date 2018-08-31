import logging
import os

from jinja2 import Environment, FileSystemLoader

log = logging.getLogger(__name__)


def generate_xml(task, obj, template_file, target_filepath):
    """
    Build Jinja2 template and write it to target file.

    :param BaseTask task: Task object that was called
    :param Object obj: The Cilantro Object to be used in the template
    :param str template_file: name of the template file to be used
    :param str target_filepath: name of the generated XML file
    :return str: Path to generated XML file
    """
    env = Environment(
        loader=FileSystemLoader('resources'),
        trim_blocks=True,
        lstrip_blocks=True)
    # Some functions which may be needed in the template (logic)
    env.globals['path_join'] = os.path.join

    template = env.get_template(template_file)
    filled_template = template.render(task=task, obj=obj)

    _write_xml_to_file(filled_template, target_filepath)
    return os.path.join(target_filepath)


def _write_xml_to_file(template, target_filepath):
    log.debug("Saving XML file to" + os.path.join(target_filepath))
    with open(target_filepath, "w") as text_file:
        text_file.write(str(template))
