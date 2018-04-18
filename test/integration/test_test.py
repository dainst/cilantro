import os
import time
# noinspection PyUnresolvedReferences
import test.integration.env
import unittest
from flask import json
from run_service import app
from pathlib import Path


wait_time = 15000
retry_time = 100

staging_dir = os.environ['STAGING_DIR']
working_dir = os.environ['WORKING_DIR']
repository_dir = os.environ['REPOSITORY_DIR']


def _wait_for_file(path):
    waited = 0
    file = Path(path)
    while not file.is_file():
        if waited > wait_time:
            return False
        else:
            waited += retry_time
            time.sleep(0.001 * retry_time)
    return True


class JobTypeTestTest(unittest.TestCase):

    def setUp(self):
        app.testing = True
        self.client = app.test_client()

    def test_success(self):
        response = self.client.post('/test/foo')
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual('Accepted', data['status'])

        path = os.path.join(repository_dir, 'foo', 'image1.jpg')
        self.assertTrue(_wait_for_file(path), "expected %s to be present" % path)

        job_id = data['job_id']
        self.assertEqual('PENDING', self._get_status(job_id))
        self.assertTrue(self._wait_for_status(job_id, 'SUCCESS'), "timeout while waiting for status 'SUCCESS'")

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
