import os
import shutil

from utils.celery_client import celery_app
from workers.base_task import BaseTask, ObjectTask
from utils.object import Object
from workers.convert.convert_pdf import split_merge_pdf

repository_dir = os.environ['REPOSITORY_DIR']
working_dir = os.environ['WORKING_DIR']
staging_dir = os.environ['STAGING_DIR']


class CreateObjectTask(ObjectTask):
    """
    Create a Cilantro-Object, the metadatas and the data files in it.
    Split and merge pdf given files.

    TaskParams:
    -str user: user ID
    -dic metadata: The metadata of the object
    -list files: the file informations for the object
    -list parts: the list of the subchild objects of the object.

    Preconditions:
    -files in staging

    Creates:
    -An Object in the working dir
    """
    name = "create_object"

    def process_object(self, obj):
        user = self.get_param('user')
        _initialize_object(obj, self.params, user)
        return {'object_id': self._get_object_id()}

    def _get_object_id(self):
        try:
            object_id = self.get_param('object_id')
        except KeyError:
            object_id = self.job_id
        if not object_id:
            object_id = self.job_id
        return object_id


CreateObjectTask = celery_app.register_task(CreateObjectTask())


def _initialize_object(obj, params, user):
    obj.set_metadata_from_dict(params['metadata'])
    if 'files' in params:
        _add_files(obj, params['files'], user)
    if 'parts' in params:
        for part in params['parts']:
            _initialize_object(obj.add_child(), part, user)


def _add_files(obj, files, user):
    pdf_files = []
    for file in files:
        suffix = (file['file']).split('.')[-1]

        src = os.path.join(staging_dir, user, file['file'])
        if suffix == 'pdf':
            pdf_files.append({'file': src, 'range': file['range']})
        else:
            obj.add_file(Object.INITIAL_REPRESENTATION, src)

    if len(pdf_files) > 0:
        rep_dir = obj.get_representation_dir(Object.INITIAL_REPRESENTATION)
        split_merge_pdf(pdf_files, rep_dir)


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
                                       self.get_result('object_id'))
        shutil.rmtree(repository_path, ignore_errors=True)
        shutil.copytree(work_path, repository_path)


PublishToRepositoryTask = celery_app.register_task(PublishToRepositoryTask())
