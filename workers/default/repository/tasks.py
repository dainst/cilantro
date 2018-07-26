import os
import shutil
from pathlib import Path

from utils.celery_client import celery_app
from workers.base_task import BaseTask
from utils.object import Object

repository_dir = os.environ['REPOSITORY_DIR']
working_dir = os.environ['WORKING_DIR']
staging_dir = os.environ['STAGING_DIR']


class CreateObjectTask(BaseTask):
    name = "create_object"

    def execute_task(self):
        user = self.get_param('user')
        obj = Object(self.get_work_path())
        obj.set_metadata_from_dict(self.get_param('metadata'))
        files = self.get_param('files')
        self._add_files(obj, files, user)
        if 'parts' in self.params:
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
            representation = Path(src).suffix.split('.')[-1].lower()[:3]
            obj.add_file(representation, src)


CreateObjectTask = celery_app.register_task(CreateObjectTask())


class PublishToRepositoryTask(BaseTask):
    """
    Copy the given dir-trees from work dir to the repository.

    TaskParams:

    Preconditions:

    Creates:
    -a copy of the work dir in the repository.
    """
    name = "publish_to_repository"

    def execute_task(self):
        work_path = self.get_work_path()
        repository_path = os.path.join(repository_dir, self.job_id)
        shutil.rmtree(repository_path, ignore_errors=True)
        shutil.copytree(work_path, repository_path)


PublishToRepositoryTask = celery_app.register_task(PublishToRepositoryTask())
