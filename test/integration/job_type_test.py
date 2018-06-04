import os
import shutil
import time
# noinspection PyUnresolvedReferences
import unittest
from flask import json
from run_service import app
from pathlib import Path
import logging

log = logging.getLogger(__name__)
wait_time = 20000
retry_time = 100


class JobTypeTest(unittest.TestCase):

    resource_dir = os.environ['RESOURCE_DIR']
    staging_dir = os.environ['STAGING_DIR']
    working_dir = os.environ['WORKING_DIR']
    repository_dir = os.environ['REPOSITORY_DIR']

    def setUp(self):
        try:
            os.makedirs(self.staging_dir)
            os.makedirs(self.working_dir)
            os.makedirs(self.repository_dir)
        except OSError:
            pass

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

    def assert_status(self, job_id, expected_status):
        waited = 0
        status = self.get_status(job_id)
        while status != expected_status:
            if waited > wait_time:
                raise AssertionError(f"experienced timeout while waiting for "
                                     f"status '{expected_status}', last status "
                                     f"was '{status}'")
            else:
                waited += retry_time
                time.sleep(0.001 * retry_time)
            status = self.get_status(job_id)

    def get_status(self, job_id):
        response = self.client.get(f'/job/{job_id}')
        data = json.loads(response.get_data(as_text=True))
        return data['status']

    def post_job(self, job_type, object_id):
        response = self.client.post(f'/job/{job_type}/{object_id}')
        return json.loads(response.get_data(as_text=True))

    def stage_resource(self, folder, object_id):
        source = os.path.join(self.resource_dir, folder, object_id)
        target = os.path.join(self.staging_dir, object_id)
        try:
            shutil.copytree(source, target)
        except FileExistsError:
            pass

    def unstage_resource(self, object_id):
        source = os.path.join(self.staging_dir, object_id)
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
