import unittest
import json

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

        all_jobs = self.client.get('/job/jobs', headers=get_auth_header())
        all_jobs_json = all_jobs.get_json()
        this_job_json = all_jobs_json[len(all_jobs_json) - 1]

        self.assertTrue(this_job_json["job_id"])
        self.assertEqual("test_user", this_job_json["user"])
        self.assertEqual("job2", this_job_json["job_type"])
        self.assertEqual('job2-some_tiffs/test.tif-some_tiffs/test2.tiff',
                         this_job_json["name"])

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
