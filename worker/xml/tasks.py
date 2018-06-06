from worker.tasks import BaseTask
from worker.xml.xml_generator import generate_xml
from utils.celery_client import celery_app


@celery_app.task(bind=True, name="generate_marcxml", base=BaseTask)
def task_generate_marcxml(self, object_id, job_id):
    work_path = self.get_work_path(job_id)
    generate_xml(work_path, xml_type='marc')


@celery_app.task(bind=True, name="generate_ojsxml", base=BaseTask)
def task_generate_ojsxml(self, object_id, job_id):
    work_path = self.get_work_path(job_id)
    generate_xml(work_path, xml_type='ojs')
