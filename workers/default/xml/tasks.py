import os
import logging

from utils.celery_client import celery_app

from workers.base_task import ObjectTask
from workers.default.xml.xml_generator import generate_xml
from workers.default.xml.xml_validator import validate_xml


log = logging.getLogger(__name__)


class GenerateXMLTask(ObjectTask):
    """
    Generate an XML based on a data.json file and validate it.

    The parameter xml_type makes the function use the right template
    and target file name.

    TaskParams:
    -str xml_type: name of the type of XML to be generated

    Preconditions:
    -data.json in the working dir

    Creates:
    -ojs_import.xml
    """

    name = "generate_xml"

    def process_object(self, obj):
        template_file = self.get_param('template_file')
        target_filepath = os.path.join(obj.path,
                                       self.get_param('target_filename'))
        try:
            dtd_file = 'resources/' + self.get_param('dtd_file')
        except KeyError:
            dtd_file = None
        try:
            schema_file = 'resources/' + self.get_param('schema_file')
        except KeyError:
            schema_file = None

        generated_xml_file = generate_xml(self, obj, template_file,
                                          target_filepath)

        validate_xml(generated_xml_file, dtd_file_path=dtd_file,
                     schema_file_path=schema_file)


GenerateXMLTask = celery_app.register_task(GenerateXMLTask())


def _read_file(path):
    template_file = open(path, 'r')
    template_string = template_file.read()
    template_file.close()

    return template_string
