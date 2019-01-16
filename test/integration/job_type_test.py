import os
import shutil
import time
import unittest
import logging

from json import JSONDecodeError
from pathlib import Path

from flask import json
from service.run_service import app
from test.service.user.user_utils import get_auth_header, test_user

log = logging.getLogger(__name__)
retry_time = 100


def _assert_wait_time(waited, wait_time):
    if waited > wait_time:
        raise TimeoutError()
    else:
        time.sleep(0.001 * retry_time)
        return waited + retry_time


class JobTypeTest(unittest.TestCase):
    resource_dir = os.environ['TEST_RESOURCE_DIR']
    staging_dir = os.environ['STAGING_DIR']
    working_dir = os.environ['WORKING_DIR']
    repository_dir = os.environ['REPOSITORY_DIR']
    archaeocloud_dir = os.environ['ARCHAEOCLOUD_PATH']
    BOOKSCAN_PATH = os.path.join(archaeocloud_dir, 'aronscans', 'bookscans')
    PDF_PATH = os.path.join(archaeocloud_dir, 'aronscans', 'download-book')
    METS_PATH = os.path.join(archaeocloud_dir, 'S-Arachne', 'MetsDocuments')
    TEI_PATH = os.path.join(archaeocloud_dir, 'S-Arachne', 'TeiDocuments')
    ARCHIVE_PATH = os.path.join(archaeocloud_dir, 'historical-books-archive',
                                'DAI')
    PTIF_PATH = os.path.join(archaeocloud_dir, 'S-Arachne', 'arachne4scans',
                             'arachne4webimages', 'bookscans')

    def setUp(self):
        os.makedirs(self.staging_dir, exist_ok=True)
        os.makedirs(self.working_dir, exist_ok=True)
        os.makedirs(self.repository_dir, exist_ok=True)
        os.makedirs(self.archaeocloud_dir, exist_ok=True)
        os.makedirs(self.BOOKSCAN_PATH, exist_ok=True)
        os.makedirs(self.PDF_PATH, exist_ok=True)
        os.makedirs(self.METS_PATH, exist_ok=True)
        os.makedirs(self.ARCHIVE_PATH, exist_ok=True)
        os.makedirs(self.PTIF_PATH, exist_ok=True)

        app.testing = True
        self.client = app.test_client()

    def tearDown(self):
        shutil.rmtree(self.staging_dir, ignore_errors=True)
        shutil.rmtree(self.working_dir, ignore_errors=True)
        shutil.rmtree(self.repository_dir, ignore_errors=True)
        shutil.rmtree(self.BOOKSCAN_PATH, ignore_errors=True)
        shutil.rmtree(self.PDF_PATH, ignore_errors=True)
        shutil.rmtree(self.METS_PATH, ignore_errors=True)
        shutil.rmtree(self.ARCHIVE_PATH, ignore_errors=True)
        shutil.rmtree(self.PTIF_PATH, ignore_errors=True)

    def assert_file_in_repository(self, object_id, file_path,
                                  timeout='DEFAULT_TEST_TIMEOUT'):
        """
        Assert that a file is present in the repository.

        :param str object_id:
        :param str file_path:
        :param str timeout: Name of timeout in ENV file
        :return:
        """
        wait_time = _get_wait_time(timeout)
        waited = 0
        file = Path(os.path.join(self.repository_dir, object_id, file_path))
        while not file.is_file():
            if waited > wait_time:
                raise AssertionError(f"experienced timeout ({wait_time/1000}s) "
                                     f"while waiting for file '{file_path}' to "
                                     f"appear in repository")
            else:
                waited += retry_time
                time.sleep(0.001 * retry_time)

    def assert_job_successful(self, task_ids, timeout='DEFAULT_TEST_TIMEOUT'):
        """
        Assert that a job completed successfully.

        Fails if one of the tasks given is in failure state or when wait time
        is reached.

        :param str task_ids:
        :param str timeout: Name of timeout in ENV file
        :return:
        """
        wait_time = _get_wait_time(timeout)
        waited = 0
        success = False
        while not success:
            for task_id in task_ids:
                status = self.get_status(task_id)['status']
                if status == 'FAILURE':
                    raise AssertionError("child task in FAILURE state")
                elif status == 'SUCCESS':
                    success = True
                else:
                    success = False
                    continue
            try:
                waited = _assert_wait_time(waited, wait_time)
            except TimeoutError:
                raise AssertionError(f"experienced timeout ({wait_time/1000}s) "
                                     f"while waiting for SUCCESS status")

    def assert_status(self, job_id, expected_status, timeout='DEFAULT_TEST_TIMEOUT'):
        """
        Assert that a job has a certain status.

        :param str job_id:
        :param str expected_status:
        :param str timeout: Name of timeout in ENV file
        :return:
        """
        wait_time = _get_wait_time(timeout)
        waited = 0
        status = self.get_status(job_id)
        while status != expected_status:
            try:
                waited = _assert_wait_time(waited, wait_time)
            except TimeoutError:
                raise AssertionError(f"experienced timeout ({wait_time/1000}s) "
                                     f"while waiting for status "
                                     f"'{expected_status}', last status was "
                                     f"'{status}'")
            status = self.get_status(job_id)['status']

    def get_status(self, job_id):
        """
        Get the job status.

        This includes the status string and an optional result object.

        :param str job_id:
        :return dict:
        """
        response = self.client.get(f'/job/{job_id}')
        return json.loads(response.get_data(as_text=True))

    def post_job(self, job_type, data):
        """
        Create a new job.

        The result object contains the job_id for the new job that can be used
        to query the status and result.

        :param str job_type:
        :param data: Parameters passed to the job
        :return tuple: The result object and the HTTP status code
        """
        response = self.client.post(
            f'/job/{job_type}',
            data=json.dumps(data),
            content_type='application/json',
            headers=get_auth_header()
            )
        try:
            data = json.loads(response.get_data(as_text=True))
        except JSONDecodeError:
            data = ""
        return data, response.status_code

    def stage_resource(self, folder, path):
        """
        Copy a resource (file oder folder) to the staging folder.

        :param str folder: The source folder
        :param str path: The relative path to the resource
        :return:
        """
        source = os.path.join(self.resource_dir, folder, path)
        target = os.path.join(self.staging_dir, test_user, path)
        try:
            if os.path.isdir(source):
                shutil.copytree(source, target)
            else:
                os.makedirs(os.path.dirname(target), exist_ok=True)
                shutil.copyfile(source, target)
        except FileExistsError:
            pass

    def unstage_resource(self, path):
        """
        Remove a resource (file or folder) from the staging folder.

        :param str path: The relative path to the resource in the staging dir
        :return:
        """
        source = os.path.join(self.staging_dir, test_user, path)
        try:
            shutil.rmtree(source)
        except FileNotFoundError:
            pass

    def remove_object_from_repository(self, object_id):
        """
        Remove an object from the repository.

        :param str object_id:
        :return:
        """
        source = os.path.join(self.repository_dir, object_id)
        try:
            shutil.rmtree(source)
        except FileNotFoundError:
            pass

    def load_params_from_file(self, folder, path):
        """
        Load job params from a JSON file.

        :param str folder: The source folder
        :param str path: The relative path to the JSON file
        :return: The parsed JSON
        """
        source = os.path.join(self.resource_dir, folder, path)
        with open(source) as data_object:
            data = json.load(data_object)
        return data


def _get_wait_time(timeout='DEFAULT_TEST_TIMEOUT'):
    """
    Determine the waittime.

    Order: specific timeout from env, default timeoutfrom env, 10s.

    :param str timeout: The name of the timeout variable
    :return int: the determined wait time
    """
    wait_time = os.environ.get(timeout)
    if not (wait_time or timeout is 'DEFAULT_TEST_TIMEOUT'):
        wait_time = os.environ.get('DEFAULT_TEST_TIMEOUT')
    if not wait_time:
        wait_time = 10000
    return int(wait_time)
