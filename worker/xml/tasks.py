import os

from worker.tasks import BaseTask
from worker.metadata.loader import load_metadata
from worker.xml.xml_generator import generate_xml
from worker.xml.marc_xml_generator import generate_marc_xml
from utils.celery_client import celery_app


@celery_app.task(bind=True, name="generate_marc_xml", base=BaseTask)
def task_generate_marc_xml(self, object_id, job_id, xml_template_path):
    work_path = self.get_work_path(job_id)
    data = load_metadata(work_path)
    xml_template_string = _read_template_file(xml_template_path)
    generate_marc_xml(work_path, data, xml_template_string)


@celery_app.task(bind=True, name="generate_xml", base=BaseTask)
def task_generate_ojs_xml(self, object_id, job_id, xml_template_path):
    work_path = self.get_work_path(job_id)
    data = load_metadata(work_path)
    xml_template_string = _read_template_file(xml_template_path)
    generate_xml(work_path, data, xml_template_string)


def _read_template_file(path):
    template_file = open(path, 'r')
    template_string = template_file.read()
    template_file.close()

    return template_string
