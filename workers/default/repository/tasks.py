import os
import shutil

from utils.celery_client import celery_app
from workers.base_task import BaseTask
from utils.object import Object

repository_dir = os.environ['REPOSITORY_DIR']
working_dir = os.environ['WORKING_DIR']
staging_dir = os.environ['STAGING_DIR']


def _copy_path(src, dest):
    """
    Recursively copies and flattens the given paths
    :param str src:
    :param str dest:
    """
    if os.path.isdir(src):
        for path in os.listdir(src):
            _copy_path(os.path.join(src, path), dest)
    else:
        shutil.copy2(src, dest)


class RetrieveFromStagingTask(BaseTask):

    name = "retrieve_from_staging"

    def execute_task(self):
        staging_path = os.path.join(staging_dir)

        paths = self.get_param('paths')
        for path in paths:
            src = os.path.join(staging_path, path)
            dest = os.path.join(self.get_work_path())
            _copy_path(src, dest)


RetrieveFromStagingTask = celery_app.register_task(RetrieveFromStagingTask())


class RetrieveObjectDataFromStagingTask(BaseTask):
    name = "retrieve_object_data_from_staging"

    def execute_task(self):
        staging_path = os.path.join(staging_dir)

        files = self.get_param('files')
        for file in files:
            src = os.path.join(staging_path, file['file'])
            dest = os.path.join(self.get_work_path())
            _copy_path(src, dest)

        parts = self.get_param('parts')
        for part in parts:
            self._execute_for_part(part)

    def _execute_for_part(self, part):
        staging_path = os.path.join(staging_dir)

        files = self.get_param('files')
        for file in files:
            src = os.path.join(staging_path, file['file'])
            dest = os.path.join(self.get_work_path())
            _copy_path(src, dest)
        if 'parts' in part:
            for subpart in part['parts']:
                self._execute_for_part(subpart)

    @staticmethod
    def _add_files(files, obj):

        staging_path = os.path.join(staging_dir)
        for file in files:
            src = os.path.join(staging_path, file['file'])
            with open(src, 'rb') as stream:
                obj.add_file(file['file'], os.path.splitext(file['file'])[1][1:].strip(), stream)


RetrieveObjectDataFromStagingTask = celery_app.register_task(RetrieveObjectDataFromStagingTask())


class PublishToRepositoryTask(BaseTask):

    name = "publish_to_repository"

    def execute_task(self):
        work_path = self.get_work_path()
        repository_path = os.path.join(repository_dir, self.job_id)
        if os.path.exists(repository_path):
            shutil.rmtree(repository_path)
        shutil.copytree(work_path, repository_path)


PublishToRepositoryTask = celery_app.register_task(PublishToRepositoryTask())
