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

        response = self.client.post('/job/job2', data=json.dumps(data),
                                    headers=get_auth_header())
        self.assertEqual(response.status_code, 202)
        response_json = response.get_json()
        self.assertEqual(response_json['status'], 'Accepted')

        response2 = self.client.get('/job/jobs', headers=get_auth_header())
        response2_json = response2.get_json()
        self.assertIn("job_id", str(response2_json))
        self.assertIn("'user': 'test_user'", str(response2_json))
        self.assertIn("'job_type': 'job2'", str(response2_json))

    def test_create_job_no_payload(self):
        """Job creation has to fail without POST payload."""
        response = self.client.post('/job/job1',
                                    headers=get_auth_header())
        self.assertEqual(response.status_code, 400)
        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "invalid_job_params")
        self.assertEqual(response_json['error']['message'],
                         "No request payload found")

    def test_create_job_invalid_json(self):
        """Test job creation to fail when the POST payload is not JSON."""
        response = self.client.post('/job/job1', data="jkhsadfj,';",
                                    headers=get_auth_header())
        self.assertEqual(response.status_code, 400)
        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "bad_request")

    def test_create_job_unknown_job_type(self):
        """Test job creation to fail when the job definition is not found."""
        response = self.client.post('/job/job3', data='{}',
                                    headers=get_auth_header())
        self.assertEqual(response.status_code, 404)

        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "unknown_job_type")
        self.assertEqual(response_json['error']['message'],
                         "No job definition file found")

    def test_create_job_no_schema(self):
        """Test failing job creation when no schema file is found."""
        response = self.client.post('/job/job1', data='{}',
                                    headers=get_auth_header())
        self.assertEqual(response.status_code, 404)
        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "unknown_job_type")
        error_message = ("[Errno 2] No such file or directory: "
                         "'test/resources/configs/config_valid/job_types"
                         "/schemas/job1_schema.json'")
        self.assertEqual(response_json['error']['message'], error_message)

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

        response = self.client.post('/job/job2', data=json.dumps(data),
                                    headers=get_auth_header())
        self.assertEqual(response.status_code, 400)

        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "invalid_job_params")
        self.assertTrue("Additional properties are not allowed" in
                        response_json['error']['message'])

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

        response = self.client.post('/job/job2', data=json.dumps(data),
                                    headers=get_auth_header())
        self.assertEqual(response.status_code, 400)

        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "invalid_job_params")
        self.assertTrue("is a required property" in
                        response_json['error']['message'])

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

        response = self.client.post('/job/job2', data=json.dumps(data),
                                    headers=get_auth_header())
        self.assertEqual(response.status_code, 400)

        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "invalid_job_params")
        self.assertTrue("is not of type" in response_json['error']['message'])
