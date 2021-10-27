import os
import shutil
import glob

from utils.celery_client import celery_app
from workers.base_task import BaseTask, ObjectTask
from utils.repository import generate_repository_path
from utils.job_db import JobDb

from utils import cilantro_info_file

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

    def process_object(self, obj):
        oid = self._generate_object_id()

        self.job_db.set_job_object_id(self.parent_job_id, oid)
        staging_directory = os.path.join(
            staging_dir, 
            self.params['user'], 
            self.params['path']
        )

        cilantro_info_file.write_processing_started(staging_directory, self.parent_job_id)

        self._initialize_object(obj, self.params, oid)
        return {'object_id': oid}

    def _generate_object_id(self):
        part_a = self.get_param('id')
        part_b = self.job_db.get_next_unique_object_id_suffix()
        return f"{part_a}_{part_b}"

        
    def _initialize_object(self, obj, params, oid):
        obj.id = oid
        obj.metadata = params['metadata']
        self._initialize_files(obj, params['path'], params['user'],
                        params['initial_representation'])
        obj.write()


    filename_extension_mapping = {
        'pdf': ['**/*.pdf', '**/*.PDF'],
        'tif': ['**/*.tif', '**/*.tiff', '**/*.TIF', '**/*.TIFF'],
        'txt': ['**/*.txt', '**/*.TXT']
    }

    def _initialize_files(self, obj, path, user, init_rep):

        files_grabbed = []
        for files in filename_extension_mapping[init_rep]:
            files_grabbed.extend(glob.glob(
                os.path.join(staging_dir, user, path, files),
                recursive=True
            ))

        if len(files_grabbed) < 1:
            raise Exception(f'no valid job files found in {path}')

        for file_name in files_grabbed:
            obj.add_file(init_rep, file_name)



CreateObjectTask = celery_app.register_task(CreateObjectTask())


class CreateComplexObjectTask(ObjectTask):
    name = "create_complex_object"

    def process_object(self, obj):

        oid = self._generate_object_id()

        self.job_db.set_job_object_id(self.parent_job_id, oid)
        object_staging_path = os.path.join(
            staging_dir, 
            self.params['user'],
            self.params['path']
        )

        cilantro_info_file.write_processing_started(object_staging_path, self.parent_job_id)


        self._initialize_object(obj, self.params, oid)
        return {'object_id': oid}

    def _initialize_object(self, obj, params, oid):
        obj.id = oid
        obj.metadata = params['metadata']
        self._initialize_files(obj, params['path'], params['user'],
                        params['copy_instructions'])
        obj.write()

    def _initialize_files(self, obj, path, user, copy_instructions):
        self.log.error("Copying files")
        self.log.error(copy_instructions)
        for source_dir, (target_dir, pattern) in copy_instructions.items():
            glob_path = os.path.join(staging_dir, user, path, source_dir, pattern)

            files_grabbed = glob.glob(glob_path)

            if len(files_grabbed) == 0:
                raise Exception((f"no valid file found in {glob_path}."))
            
            for file_name in files_grabbed:
                obj.add_file(target_dir, file_name)

    def _generate_object_id(self):
        part_a = self.get_param('id')
        part_b = self.job_db.get_next_unique_object_id_suffix()
        return f"{part_a}_{part_b}"


CreateComplexObjectTask = celery_app.register_task(CreateComplexObjectTask())

def _get_work_path(params):
    abs_path = os.path.join(working_dir, params['work_path'])
    if not os.path.exists(abs_path):
        os.mkdir(abs_path)
    return abs_path


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

    def execute_task(self):
        work_path = self.get_work_path()
        archive_path = os.path.join(archive_dir,
                                    generate_repository_path(
                                        self.get_result('object_id')))
        shutil.rmtree(archive_path, ignore_errors=True)
        shutil.copytree(work_path, archive_path)


PublishToArchiveTask = celery_app.register_task(PublishToArchiveTask())
