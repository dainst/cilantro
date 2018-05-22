import os
import shutil
import time
# noinspection PyUnresolvedReferences
import test.integration.env
import unittest
from flask import json
from run_service import app
from pathlib import Path
import logging

log = logging.getLogger(__name__)
wait_time = 5000
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
                raise AssertionError("experienced timeout while waiting for "
                                     "file '%s' to appear in repository" % file_path)
            else:
                waited += retry_time
                time.sleep(0.001 * retry_time)

    def assert_status(self, job_id, expected_status):
        waited = 0
        status = self.get_status(job_id)
        while status != expected_status:
            if waited > wait_time:
                raise AssertionError("experienced timeout while waiting for "
                                     "status '%s', last status was '%s'" % (expected_status, status))
            else:
                waited += retry_time
                time.sleep(0.001 * retry_time)
            status = self.get_status(job_id)

    def get_status(self, job_id):
        response = self.client.get('/job/%s' % job_id)
        data = json.loads(response.get_data(as_text=True))
        return data['status']

    def post_job(self, job_type, object_id):
        response = self.client.post('/job/%s/%s' % (job_type, object_id))
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

    def remove_file_from_repository(self, object_id, file_path):
        file = os.path.join(self.repository_dir, object_id, file_path)
        log.info(f'FILE: {file}')
        try:
            os.remove(file)
            print(f'\n\n\nremoved {file}\n\n\n')
        except PermissionError:
            user = os.getuid()
            group = os.getegid()
            raise PermissionError(f'Permission for removing {file} denied for user {user} group {group}')
