import os

from utils.celery_client import celery_app

from workers.base_task import BaseTask
from workers.default.xml.xml_generator import generate_xml
from workers.default.xml.marc_xml_generator import generate_marc_xml
from workers.default.xml.xml_validator import validate_xml
from utils.object import Object


class GenerateMarcXMLTask(BaseTask):
    """
    Generate a Marc XML for every article based on a data.json file and validate them.

    TaskParams:
    -str xml_template_path: path to the xml template

    Preconditions:
    -data.json in the working dir

    Creates:
    -for each article:
        -marc.xml in articles/article_dir
    """
    name = "generate_marc_xml"

    def execute_task(self):
        work_path = self.get_work_path()
        obj = Object(work_path)
        xml_template_string = _read_file(self.get_param('xml_template_path'))
        generate_marc_xml(obj, xml_template_string)

        marc_schema_file = 'resources/MARC21slim.xsd'

        for article_dir in os.listdir(os.path.join(work_path, 'parts')):
            file_path = os.path.join(work_path, 'parts', article_dir, 'marc.xml')
            validate_xml(file_path, schema_file_path=marc_schema_file)


class GenerateXMLTask(BaseTask):
    """
    Generate an XML based on a data.json file and validate it.

    TaskParams:
    -str xml_template_path: path to the xml template

    Preconditions:
    -data.json in the working dir

    Creates:
    -ojs_import.xml
    """
    name = "generate_xml"

    def execute_task(self):
        work_path = self.get_work_path()
        obj = Object(work_path)
        articles_meta = []
        for part in obj.get_children():
            articles_meta.append(part.metadata.to_dict())

        data = {'data': {
            **obj.metadata.to_dict(),
            'auto_publish_issue': self.get_param('auto_publish_issue'),
            'default_create_frontpage': self.get_param('default_create_frontpage'),
        },
            'articles': articles_meta}

        xml_template_string = _read_file(self.get_param('xml_template_path'))
        generated_xml_file = generate_xml(obj.path, data, xml_template_string)
        validate_xml(generated_xml_file, dtd_validation=True)


GenerateMarcXMLTask = celery_app.register_task(GenerateMarcXMLTask())
GenerateXMLTask = celery_app.register_task(GenerateXMLTask())


def _read_file(path):
    template_file = open(path, 'r')
    template_string = template_file.read()
    template_file.close()

    return template_string
