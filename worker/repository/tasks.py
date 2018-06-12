import os
import shutil

from utils.celery_client import celery_app
from worker.tasks import BaseTask

repository_dir = os.environ['REPOSITORY_DIR']
working_dir = os.environ['WORKING_DIR']
staging_dir = os.environ['STAGING_DIR']


class RetrieveFromStagingTask(BaseTask):

    name = "retrieve_from_staging"

    def execute_task(self):
        staging_path = os.path.join(staging_dir, self.object_id)
        work_path = self.get_work_path(self.job_id)
        if os.path.exists(work_path):
            shutil.rmtree(work_path)
        shutil.copytree(staging_path, work_path)


RetrieveFromStagingTask = celery_app.register_task(RetrieveFromStagingTask())


class PublishToRepositoryTask(BaseTask):

    name = "publish_to_repository"

    def execute_task(self):
        work_path = self.get_work_path(self.job_id)
        repository_path = os.path.join(repository_dir, self.object_id)
        if os.path.exists(repository_path):
            shutil.rmtree(repository_path)
        shutil.copytree(work_path, repository_path)


PublishToRepositoryTask = celery_app.register_task(PublishToRepositoryTask())
