import os

from utils.celery_client import celery_app

from workers.base_task import BaseTask
from workers.default.metadata.loader import load_metadata
from workers.default.xml.xml_generator import generate_xml
from workers.default.xml.marc_xml_generator import generate_marc_xml
from workers.default.xml.xml_validator import validate_xml


class GenerateMarcXMLTask(BaseTask):
    name = "generate_marc_xml"

    def execute_task(self):
        work_path = self.get_work_path()
        data = load_metadata(work_path)
        xml_template_string = _read_file(self.get_param('xml_template_path'))
        generate_marc_xml(work_path, data, xml_template_string)

        for article_dir in os.listdir(os.path.join(work_path, 'articles')):
            file_path = os.path.join(work_path, 'articles', article_dir, 'marc.xml')
            validate_xml(file_path)


class GenerateXMLTask(BaseTask):
    name = "generate_xml"

    def execute_task(self):
        work_path = self.get_work_path()
        data = load_metadata(work_path)
        xml_template_string = _read_file(self.get_param('xml_template_path'))

        generated_xml_file = generate_xml(work_path, data, xml_template_string)

        validate_xml(generated_xml_file)


GenerateMarcXMLTask = celery_app.register_task(GenerateMarcXMLTask())
GenerateXMLTask = celery_app.register_task(GenerateXMLTask())


def _read_file(path):
    template_file = open(path, 'r')
    template_string = template_file.read()
    template_file.close()

    return template_string
