import unittest
import json
import os
import datetime

from pymongo import MongoClient

from unittest.mock import patch

from service.run_service import app
from test.service.user.user_utils import get_auth_header


class JobControllerTest(unittest.TestCase):
    """Test the job controller to validate the parameter payload."""

    def setUp(self):
        app.testing = True
        self.client = app.test_client()
        self.env = patch.dict(
            'os.environ',
            {'CONFIG_DIR': "test/resources/configs/config_valid"})
        self.env.start()

    def tearDown(self):
        self.env.stop()

    def test_list_job_filter(self):
        """
        Test the filtering of old jobs when listing.

        This test creates 3 test jobs. 2 of them are manipulated directly on
        the job database (mongodb), so that the updated timestamp is 1 more
        day than the threshold value for old jobs. The listing is checked
        for appearance of the jobs. Jobs older than the threshold and being
        successful are not to show up.
        """
        data = {
            "metadata": {
                "title": "Test-Title",
                "description": "Test-Description",
                "year": 1992
                },
            "files": [
                {"file": "some_tiffs/test.tif"},
                {"file": "some_tiffs/test2.tiff"}
                ]
            }
        job1_response = self._make_request('/job/job2', json.dumps(data), 202)
        job_id1 = job1_response.get_json()['job_id']
        job2_response = self._make_request('/job/job2', json.dumps(data), 202)
        job_id2 = job2_response.get_json()['job_id']
        self._make_request('/job/job2', json.dumps(data), 202)

        # hack to change the updated timestamp and job status on some test jobs
        client = MongoClient(os.environ['JOB_DB_URL'],
                             int(os.environ['JOB_DB_PORT']))
        db = client[os.environ['JOB_DB_NAME']]
        threshold_days = int(os.environ['OLD_JOBS_THRESHOLD_DAYS'])
        timestamp = (datetime.datetime.now() -
                     datetime.timedelta(days=threshold_days + 1))
        db.jobs.update_one({"job_id": job_id1},
                           {'$set': {'state': 'success',
                                     'updated': timestamp}})
        db.jobs.update_one({"job_id": job_id2},
                           {'$set': {'state': 'started',
                                     'updated': timestamp}})

        response_job_list_all = self.client.get('/job/jobs?show_all_jobs=True',
                                                headers=get_auth_header())
        job_list_all_json = response_job_list_all.get_json()

        response_job_list_filtered = self.client.get('/job/jobs',
                                                     headers=get_auth_header())
        job_list_filtered_json = response_job_list_filtered.get_json()

        self.assertTrue(len((job_list_all_json)) >
                        len((job_list_filtered_json)))

    def test_create_job_success_and_list_job(self):
        """
        Test listing of jobs.

        The test creates a job and then gets a list of all jobs.
        The job list is checked for some strings which are expected in the
        job list.
        """
        data = {
            "metadata": {
                "title": "Test-Title",
                "description": "Test-Description",
                "year": 1992
                },
            "files": [
                {"file": "some_tiffs/test.tif"},
                {"file": "some_tiffs/test2.tiff"}
                ]
            }
        self._make_request('/job/job2', json.dumps(data), 202)

        response2 = self.client.get('/job/jobs', headers=get_auth_header())
        response2_json = response2.get_json()
        self.assertIn("job_id", str(response2_json))
        self.assertIn("'user': 'test_user'", str(response2_json))
        self.assertIn("'job_type': 'job2'", str(response2_json))

    def test_create_job_no_payload(self):
        """Job creation has to fail without POST payload."""
        self._make_request('/job/job1', None, 400, 'invalid_job_params',
                           'No request payload found')

    def test_create_job_invalid_json(self):
        """Test job creation to fail when the POST payload is not JSON."""
        self._make_request('/job/job1', 'jkhsadfj,;', 400, 'bad_request')

    def test_create_job_unknown_job_type(self):
        """Test job creation to fail when the job definition is not found."""
        self._make_request('/job/job3', '{}', 404, 'unknown_job_type',
                           'No job definition file found')

    def test_create_job_no_schema(self):
        """Test failing job creation when no schema file is found."""
        error_message = ("[Errno 2] No such file or directory: "
                         "'test/resources/configs/config_valid/job_types"
                         "/schemas/job1_schema.json'")
        self._make_request('/job/job1', '{}', 404, 'unknown_job_type',
                           error_message)

    def test_create_job_unknown_param(self):
        """Test job creation to fail when there are unknown params given."""
        data = {
            "metadata": {
                "title": "Test-Title",
                "description": "Test-Description",
                "year": 1992
                },
            "files": [
                {"file": "some_tiffs/test.tif"},
                {"file": "some_tiffs/test2.tiff"}
                ],
            "bla": "blub"
            }
        self._make_request('/job/job2', json.dumps(data), 400,
                           'invalid_job_params',
                           'Additional properties are not allowed')

    def test_create_job_missing_param(self):
        """Test job creation to fail when there are params missing."""
        data = {
            "metadata": {
                "title": "Test-Title",
                "year": 1992
                },
            "files": [
                {"file": "some_tiffs/test.tif"},
                {"file": "some_tiffs/test2.tiff"}
                ]
            }
        self._make_request('/job/job2', json.dumps(data), 400,
                           'invalid_job_params', 'is a required property')

    def test_create_job_wrong_param_type(self):
        """Test job creation to fail when a param has the wrong type."""
        data = {
            "metadata": {
                "title": "Test-Title",
                "description": "Test-Description",
                "year": "1992"
                },
            "files": [
                {"file": "some_tiffs/test.tif"},
                {"file": "some_tiffs/test2.tiff"}
                ]
            }
        self._make_request('/job/job2', json.dumps(data), 400,
                           'invalid_job_params', 'is not of type')

    def _make_request(self, job_name, payload, expected_http_code,
                      expected_error_code='', expected_error_message=''):
        response = self.client.post(job_name, data=payload,
                                    headers=get_auth_header())

        self.assertEqual(response.status_code, expected_http_code)
        response_json = response.get_json()
        if str(expected_http_code)[0] == '2':
            self.assertTrue(response_json['success'])
            self.assertEqual(response_json['status'], 'Accepted')
        else:
            self.assertFalse(response_json['success'])
            self.assertEqual(response_json['error']['code'],
                             expected_error_code)
            self.assertTrue(expected_error_message in
                            response_json['error']['message'])

        return response
