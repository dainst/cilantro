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
        shutil.rmtree(self.working_dir)
        shutil.rmtree(self.repository_dir)


    def _wait_for_file(self, path):
        waited = 0
        file = Path(path)
        while not file.is_file():
            if waited > wait_time:
                return False
            else:
                waited += retry_time
                time.sleep(0.001 * retry_time)
        return True

    def _wait_for_status(self, job_id, expected_status):
        waited = 0
        status = self._get_status(job_id)
        while status != expected_status:
            if waited > wait_time:
                return False
            else:
                waited += retry_time
                time.sleep(0.001 * retry_time)
            status = self._get_status(job_id)
        return True

    def _get_status(self, job_id):
        response = self.client.get('/%s' % job_id)
        data = json.loads(response.get_data(as_text=True))
        return data['status']

    def _post_job(self, job_type, object_id):
        response = self.client.post('/%s/%s' % (job_type, object_id))
        return json.loads(response.get_data(as_text=True))
