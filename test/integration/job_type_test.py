import os
import shutil
import time
# noinspection PyUnresolvedReferences
import test.integration.env
import unittest
from flask import json
from run_service import app
from pathlib import Path

wait_time = 15000
retry_time = 100


class JobTypeTest(unittest.TestCase):

    staging_dir = os.environ['STAGING_DIR']
    working_dir = os.environ['WORKING_DIR']
    repository_dir = os.environ['REPOSITORY_DIR']

    def setUp(self):
        app.testing = True
        self.client = app.test_client()

    def tearDown(self):
        #shutil.rmtree(self.working_dir)
        #shutil.rmtree(self.repository_dir)
        pass

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
        response = self.client.get('/%s' % job_id)
        data = json.loads(response.get_data(as_text=True))
        return data['status']

    def post_job(self, job_type, object_id):
        response = self.client.post('/%s/%s' % (job_type, object_id))
        return json.loads(response.get_data(as_text=True))
