import os
import shutil
import time
import unittest
import logging
from pathlib import Path

from flask import json
from run_service import app

log = logging.getLogger(__name__)
wait_time = 20000
retry_time = 100


def _assert_wait_time(waited):
    if waited > wait_time:
        raise TimeoutError()
    else:
        time.sleep(0.001 * retry_time)
        return waited + retry_time


class JobTypeTest(unittest.TestCase):
    resource_dir = os.environ['RESOURCE_DIR']
    staging_dir = os.environ['STAGING_DIR']
    working_dir = os.environ['WORKING_DIR']
    repository_dir = os.environ['REPOSITORY_DIR']

    def setUp(self):
        os.makedirs(self.staging_dir, exist_ok=True)
        os.makedirs(self.working_dir, exist_ok=True)
        os.makedirs(self.repository_dir, exist_ok=True)

        app.testing = True
        self.client = app.test_client()

    def assert_file_in_repository(self, object_id, file_path):
        waited = 0
        file = Path(os.path.join(self.repository_dir, object_id, file_path))
        while not file.is_file():
            if waited > wait_time:
                raise AssertionError(f"experienced timeout while waiting for "
                                     f"file '{file_path}' to appear "
                                     f"in repository")
            else:
                waited += retry_time
                time.sleep(0.001 * retry_time)

    def assert_job_successful(self, task_ids):
        waited = 0
        success = False
        while not success:
            for task_id in task_ids:
                status = self.get_status(task_id)
                if status == 'FAILURE':
                    raise AssertionError("child task in FAILURE state")
                elif status == 'SUCCESS':
                    success = True
                else:
                    success = False
                    continue
            try:
                waited = _assert_wait_time(waited)
            except TimeoutError:
                raise AssertionError("experienced timeout while waiting for"
                                     "SUCCESS status")

    def assert_status(self, job_id, expected_status):
        waited = 0
        status = self.get_status(job_id)
        while status != expected_status:
            try:
                waited = _assert_wait_time(waited)
            except TimeoutError:
                raise AssertionError(f"experienced timeout while waiting for "
                                     f"status '{expected_status}', last status "
                                     f"was '{status}'")
            status = self.get_status(job_id)

    def get_status(self, job_id):
        response = self.client.get(f'/job/{job_id}')
        data = json.loads(response.get_data(as_text=True))
        return data['status']

    def post_job(self, job_type, data):
        response = self.client.post(
            f'/job/{job_type}',
            data=json.dumps(data),
            content_type='application/json'
        )
        return json.loads(response.get_data(as_text=True))

    def stage_resource(self, folder, path):
        source = os.path.join(self.resource_dir, folder, path)
        target = os.path.join(self.staging_dir, path)
        try:
            shutil.copytree(source, target)
        except FileExistsError:
            pass

    def unstage_resource(self, path):
        source = os.path.join(self.staging_dir, path)
        try:
            shutil.rmtree(source)
        except FileNotFoundError:
            pass

    def remove_object_from_repository(self, object_id):
        source = os.path.join(self.repository_dir, object_id)
        try:
            shutil.rmtree(source)
        except FileNotFoundError:
            pass

    def load_params_from_file(self, folder, path):
        source = os.path.join(self.resource_dir, folder, path)
        with open(source) as data_object:
            data = json.load(data_object)
        return data
