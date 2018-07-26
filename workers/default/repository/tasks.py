import os
import shutil

from utils.celery_client import celery_app
from workers.base_task import BaseTask

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
    """
    Copy the given dir-trees from users staging to the workpath.

    TaskParams:
    -list paths: all the paths to be copied
    -str user: User Id

    Preconditions:
    -dirs at given paths in the users staging dir.

    Creates:
    -a copy of the dirs at path in the working dir.
    """
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
