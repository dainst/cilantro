import os
import shutil

from utils.celery_client import celery_app
from workers.base_task import BaseTask

repository_dir = os.environ['REPOSITORY_DIR']
working_dir = os.environ['WORKING_DIR']
staging_dir = os.environ['STAGING_DIR']


class RetrieveFromStagingTask(BaseTask):

    name = "retrieve_from_staging"

    def execute_task(self):
        staging_path = os.path.join(staging_dir)

        # TODO: move to base class
        work_path = self.get_work_path(self.job_id)
        if os.path.exists(work_path):
            shutil.rmtree(work_path)

        files = self.get_param('files')
        for file in files:
            src = os.path.join(staging_path, file)
            dest = os.path.join(work_path, file)
            shutil.copyfile(src, dest)


RetrieveFromStagingTask = celery_app.register_task(RetrieveFromStagingTask())


class PublishToRepositoryTask(BaseTask):

    name = "publish_to_repository"

    def execute_task(self):
        work_path = self.get_work_path(self.job_id)
        repository_path = os.path.join(repository_dir, self.job_id)
        if os.path.exists(repository_path):
            shutil.rmtree(repository_path)
        shutil.copytree(work_path, repository_path)


PublishToRepositoryTask = celery_app.register_task(PublishToRepositoryTask())
