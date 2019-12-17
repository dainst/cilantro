import os
import shutil
import glob

from utils.celery_client import celery_app
from workers.base_task import BaseTask, ObjectTask
from utils.repository import generate_repository_path
from utils.job_db import JobDb
    
repository_dir = os.environ['REPOSITORY_DIR']
archive_dir = os.environ['ARCHIVE_DIR']
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
    label = "Create object"
    description = "Sets up metadata for further processing."

    def process_object(self, obj):
        oid = self._get_object_id()
        _initialize_object(obj, self.params, oid)
        return {'object_id': oid}

    def _get_object_id(self):
        try:
            object_id = self.get_param('id')
        except KeyError:
            object_id = self.job_id
        job_db = JobDb()
        uid = job_db.generate_unique_object_identifier()
        job_db.close()
        return object_id + f"_{uid}"


CreateObjectTask = celery_app.register_task(CreateObjectTask())


def _get_work_path(params):
    abs_path = os.path.join(working_dir, params['work_path'])
    if not os.path.exists(abs_path):
        os.mkdir(abs_path)
    return abs_path


def _initialize_object(obj, params, oid):
    obj.set_metadata_from_dict(params['metadata'])
    obj.metadata.id = oid
    _initialize_files(obj, params['path'], params['user'],
                      params['initial_representation'])
    obj.write()


def _initialize_files(obj, path, user, init_rep):
    types = ('*.tif', '*.tiff', '*.TIF', '*.TIFF')
    files_grabbed = []
    for files in types:
        files_grabbed.extend(glob.glob(os.path.join(staging_dir, user,
                                                    path, init_rep, files)))

    if (len(files_grabbed) < 1):
        raise Exception(f'no valid job files found in {path}')

    for file_name in files_grabbed:
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
    label = "Publish to repository"
    description = "Copies the current results into the data repository."

    def execute_task(self):
        work_path = self.get_work_path()
        repository_path = os.path.join(repository_dir,
                                       generate_repository_path(
                                           self.get_result('object_id')))
        shutil.rmtree(repository_path, ignore_errors=True)

        shutil.copytree(os.path.join(work_path, 'data', 'pdf'),
                        os.path.join(repository_path, 'data', 'pdf'))
        shutil.copytree(os.path.join(work_path, 'data', 'jpg'),
                        os.path.join(repository_path, 'data', 'jpg'))
        shutil.copy(os.path.join(work_path, 'meta.json'), repository_path)
        shutil.copy(os.path.join(work_path, 'mets.xml'), repository_path)


PublishToRepositoryTask = celery_app.register_task(PublishToRepositoryTask())


class PublishToArchiveTask(BaseTask):
    """Copy the given dir-trees from work dir to the archive."""

    name = "publish_to_archive"
    label = "Publish to archive"
    description = "Copies the current results into iDAI.archives / AtoM."

    def execute_task(self):
        work_path = self.get_work_path()
        archive_path = os.path.join(archive_dir,
                                    generate_repository_path(
                                        self.get_result('object_id')))
        shutil.rmtree(archive_path, ignore_errors=True)
        shutil.copytree(work_path, archive_path)


PublishToArchiveTask = celery_app.register_task(PublishToArchiveTask())
