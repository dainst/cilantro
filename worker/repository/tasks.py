import os
import shutil

from worker.tasks import BaseTask
from utils.celery_client import celery_app

repository_dir = os.environ['REPOSITORY_DIR']
working_dir = os.environ['WORKING_DIR']
staging_dir = os.environ['STAGING_DIR']


@celery_app.task(bind=True, name="retrieve_from_staging", base=BaseTask)
def retrieve_from_staging(self, object_id, job_id):
    if not os.path.exists(staging_dir):
        os.makedirs(staging_dir)
    if not os.path.exists(working_dir):
        os.makedirs(working_dir)
    staging_path = os.path.join(staging_dir, object_id)
    work_path = self.get_work_path(job_id)
    if os.path.exists(work_path):
        shutil.rmtree(work_path)
    shutil.copytree(staging_path, work_path)


@celery_app.task(bind=True, name="publish_to_repository", base=BaseTask)
def publish_to_repository(self, object_id, job_id):
    work_path = self.get_work_path(job_id)
    repository_path = os.path.join(repository_dir, object_id)
    if os.path.exists(repository_path):
        shutil.rmtree(repository_path)
    shutil.copytree(work_path, repository_path)

