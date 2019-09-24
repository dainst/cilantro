import os
import shutil
import glob

from utils.celery_client import celery_app
from workers.base_task import BaseTask, ObjectTask
from utils.object import Object
from utils.repository import generate_repository_path
from utils import job_db

repository_dir = os.environ['REPOSITORY_DIR']
working_dir = os.environ['WORKING_DIR']
staging_dir = os.environ['STAGING_DIR']


class CreateObjectTask(ObjectTask):
    """
    Create a Cilantro-Object, the metadatas and the data files in it.

    Preconditions:
    -files in staging

    Creates:
    -An Object in the working dir
    """
    name = "create_object"

    def process_object(self, obj):
        job_db.update_job(self.job_id, 'started')
        _initialize_object(obj, self.params)
        return {'object_id': self._get_object_id()}

    def _get_object_id(self):
        try:
            object_id = self.get_param('object_id')
        except KeyError:
            object_id = self.job_id
        return object_id


CreateObjectTask = celery_app.register_task(CreateObjectTask())


def _get_work_path(params):
    abs_path = os.path.join(working_dir, params['work_path'])
    if not os.path.exists(abs_path):
        os.mkdir(abs_path)
    return abs_path


def _initialize_object(obj, params):
    obj.set_metadata_from_dict(params['metadata'])
    _initialize_files(obj, params['path'], params['user'],
                      params['initial_representation'])


def _initialize_files(obj, path, user, init_rep):
    file_list_pattern = os.path.join(staging_dir, user, path, "*.tif") # TODO type tiff?

    for file_name in glob.iglob(file_list_pattern):
        obj.add_file(Object.INITIAL_REPRESENTATION, file_name)
        obj.add_file(init_rep, file_name)


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
        repository_path = os.path.join(repository_dir,
                                       generate_repository_path(
                                           self.get_result('object_id')))
        shutil.rmtree(repository_path, ignore_errors=True)
        shutil.copytree(work_path, repository_path)


PublishToRepositoryTask = celery_app.register_task(PublishToRepositoryTask())
