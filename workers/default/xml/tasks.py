from utils.celery_client import celery_app
from workers.base_task import BaseTask
from workers.default.metadata.loader import load_metadata
from workers.default.xml.xml_generator import generate_xml
from workers.default.xml.marc_xml_generator import generate_marc_xml


class GenerateMarcXMLTask(BaseTask):

    name = "generate_marc_xml"

    def execute_task(self):
        work_path = self.get_work_path(self.job_id)
        data = load_metadata(work_path)
        xml_template_string = _read_template_file(self.get_param('xml_template_path'))
        generate_marc_xml(work_path, data, xml_template_string)


GenerateMarcXMLTask = celery_app.register_task(GenerateMarcXMLTask())


class GenerateXMLTask(BaseTask):
    name = "generate_xml"

    def execute_task(self):
        work_path = self.get_work_path(self.job_id)
        data = load_metadata(work_path)
        xml_template_string = _read_template_file(self.get_param('xml_template_path'))
        generate_xml(work_path, data, xml_template_string)


GenerateXMLTask = celery_app.register_task(GenerateXMLTask())


def _read_template_file(path):
    template_file = open(path, 'r')
    template_string = template_file.read()
    template_file.close()

    return template_string
