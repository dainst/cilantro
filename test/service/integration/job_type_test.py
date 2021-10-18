import os
import shutil
import time
import unittest
import logging

from json import JSONDecodeError
from pathlib import Path

from flask import json
from service.run_service import app
from utils.repository import generate_repository_path
from test.service.unit.user.user_utils import get_auth_header, test_user

log = logging.getLogger(__name__)
retry_time = 5


def _assert_timeout(waited: int, timeout: int):
    """
    Check if timeout has occured for the time waited.

    :param int waited: Time already waited
    :param int timeout: Timeout in miliseconds
    """
    if waited > timeout:
        raise TimeoutError()
    else:
        time.sleep(retry_time)
        return waited + retry_time


class JobTypeTest(unittest.TestCase):
    resource_dir = os.environ['TEST_RESOURCE_DIR']
    staging_dir = os.environ['STAGING_DIR']
    working_dir = os.environ['WORKING_DIR']
    repository_dir = os.environ['REPOSITORY_DIR']
    archive_dir = os.environ['ARCHIVE_DIR']

    def setUp(self):
        os.makedirs(self.staging_dir, exist_ok=True)
        os.makedirs(self.working_dir, exist_ok=True)
        os.makedirs(self.repository_dir, exist_ok=True)
        os.makedirs(self.archive_dir, exist_ok=True)
        os.makedirs(self.archive_dir, exist_ok=True)

        app.testing = True
        self.client = app.test_client()

    def assert_file_in_repository(self, object_id: str, file_path: str,
                                  timeout: int = None):
        """
        Assert that a file is present in the repository.

        :param str object_id: The id of the cilantro object
        :param str file_path: Path of the file to assert
        :param int timeout: Timeout in miliseconds, defaults to value of environment 
        variable (if set) or hardcoded value. See _get_default_timeout.
        """
        if timeout is None:
            timeout = _get_default_timeout()
        waited = 0
        file = Path(os.path.join(self.repository_dir, generate_repository_path(
            object_id), file_path))
        while not file.is_file():
            if waited > timeout:
                raise AssertionError(
                    f"experienced timeout ({timeout / 1000}s) while waiting "
                    f"for file '{file_path}' to appear in repository")
            else:
                waited += retry_time
                time.sleep(0.001 * retry_time)

    def assert_file_in_workdir(self, job_id, path, timeout: int = None):
        """
        Assert that a file is present in the working directory.

        :param job_id: The id of the job that created the file.
        :param path: Path to the file below the job's folder.
        :param int timeout: Timeout in miliseconds, defaults to value of environment
        variable (if set) or hardcoded value. See _get_default_timeout.
        """
        if timeout is None:
            timeout = _get_default_timeout()
        waited = 0
        file = Path(os.path.join(self.working_dir, job_id, path))
        while not file.is_file():
            if waited > timeout:
                raise AssertionError(
                    f"experienced timeout ({timeout / 1000}s) while waiting "
                    f"for file '{file}' to appear in working directory")
            else:
                waited += retry_time
                time.sleep(0.001 * retry_time)

    def assert_job_successful(self, task_ids: list, timeout: int = None):
        """
        Assert that a job completed successfully.

        Fails if one of the tasks given is in failure state or when wait time
        is reached.

        :param list task_ids: List of ids of tasks
        :param int timeout: Timeout in miliseconds, defaults to value of environment 
        variable (if set) or hardcoded value. See _get_default_timeout.
        """
        if timeout is None:
            timeout = _get_default_timeout()
        waited = 0
        success = False
        while not success:
            for task_id in task_ids:
                state = self.get_job_by_id(task_id)['state']
                if state == 'failure':
                    raise AssertionError("child task in FAILURE state")
                elif state == 'success':
                    success = True
                else:
                    success = False
                    continue
            try:
                waited = _assert_timeout(waited, timeout)
            except TimeoutError:
                raise AssertionError(
                    f"experienced timeout ({timeout / 1000}s) while waiting "
                    f"for SUCCESS state")

    def assert_state(self, job_id: str, expected_state: str,
                     timeout: int = None):
        """
        Assert that a job has a certain state.

        :param str job_id: The id of the job
        :param str expected_state: The expected state of the job
        :param int timeout: Timeout in miliseconds, defaults to value of environment 
        variable (if set) or hardcoded value. See _get_default_timeout.
        """
        if timeout is None:
            timeout = _get_default_timeout()
        waited = 0
        state = self.get_job_by_id(job_id)
        while state != expected_state:
            try:
                waited = _assert_timeout(waited, timeout)
            except TimeoutError:
                raise AssertionError(
                    f"experienced timeout ({timeout / 1000}s) while waiting "
                    f"for state '{expected_state}', last state was "
                    f"'{state}'")
            state = self.get_job_by_id(job_id)['state']

    def get_job_by_id(self, job_id: str):
        """
        Get a job by its id.

        :param str job_id: The id of the job
        :return dict: The response data
        """
        response = self.client.get(f'/job/{job_id}')
        return json.loads(response.get_data(as_text=True))

    def post_job(self, job_type: str, data: dict):
        """
        Create a new job.

        The result object contains the job_id for the new job that can be used
        to query the status and result.

        :param str job_type: The type of the job
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

    def stage_resource(self, folder: str, path: str):
        """
        Copy a resource (file oder folder) to the staging folder.

        :param str folder: The source folder
        :param str path: The relative path to the resource
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

    def unstage_resource(self, path: str):
        """
        Remove a resource (file or folder) from the staging folder.

        :param str path: The relative path to the resource in the staging dir
        """
        source = os.path.join(self.staging_dir, test_user, path)
        try:
            shutil.rmtree(source)
        except FileNotFoundError:
            pass

    def remove_object_from_repository(self, object_id: str):
        """
        Remove an object from the repository.

        :param str object_id: The id of the object
        """
        source = os.path.join(self.repository_dir,
                              generate_repository_path(object_id))
        try:
            shutil.rmtree(source)
        except FileNotFoundError:
            pass

    def load_params_from_file(self, folder: str, path: str):
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


def _get_default_timeout():
    """
    Determine the timemout.

    Order:
    1) specific timeout defined by environment variable
    2) 10000 milisecoends

    :return int: The determined wait time in miliseconds
    """
    wait_time = os.environ.get('DEFAULT_TEST_TIMEOUT')
    if not wait_time:
        return 10000
    return int(wait_time)
