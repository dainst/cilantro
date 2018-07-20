import os
import shutil
from pathlib import Path

from utils.celery_client import celery_app
from workers.base_task import BaseTask
from utils.object import Object

repository_dir = os.environ['REPOSITORY_DIR']
working_dir = os.environ['WORKING_DIR']
staging_dir = os.environ['STAGING_DIR']


def _copy_path(src, dest):
    """
    Recursively copy and flatten the given paths.

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
        user = self.get_param('user')
        for path in paths:
            src = os.path.join(staging_path, user, path)
            dest = os.path.join(self.get_work_path())
            _copy_path(src, dest)


RetrieveFromStagingTask = celery_app.register_task(RetrieveFromStagingTask())


class CreateObjectTask(BaseTask):
    name = "create_object"

    def execute_task(self):
        user = self.get_param('user')
        obj = Object(self.get_work_path())
        obj.set_metadata_from_dict(self.get_param('metadata'))
        files = self.get_param('files')
        self._add_files(obj, files, user)
        self._execute_for_parts(obj, self.get_param('parts'), user)

    def _execute_for_parts(self, obj, parts, user):
        for part in parts:
            child = obj.add_child()
            child.set_metadata_from_dict(part['metadata'])

            if 'files' in part:
                self._add_files(child, part['files'], user)

            if 'parts' in part:
                self._execute_for_parts(child, part['parts'], user)

    @staticmethod
    def _add_files(obj, files, user):
        for file in files:
            src = os.path.join(staging_dir, user, file['file'])
            with open(src, 'rb') as stream:
                obj.add_file(os.path.basename(file['file']), Path(src).suffix.split('.')[-1], stream)


CreateObjectTask = celery_app.register_task(CreateObjectTask())


class PublishToRepositoryTask(BaseTask):

    name = "publish_to_repository"

    def execute_task(self):
        work_path = self.get_work_path()
        repository_path = os.path.join(repository_dir, self.job_id)
        shutil.rmtree(repository_path, ignore_errors=True)
        shutil.copytree(work_path, repository_path)


PublishToRepositoryTask = celery_app.register_task(PublishToRepositoryTask())
