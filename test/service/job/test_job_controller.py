import os
import unittest

from run_service import app
from test.service.user.user_utils import get_auth_header


class JobControllerTest(unittest.TestCase):

    def setUp(self):
        app.testing = True
        self.client = app.test_client()
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_valid"

    def test_create_job_success(self):
        response = self.client.post('/job/job1',
                                    headers=get_auth_header())
        self.assertEqual(response.status_code, 202)
        response_json = response.get_json()
        self.assertEqual(response_json['status'], 'Accepted')

    def test_create_job_invalid_json(self):
        response = self.client.post('/job/job1', data="jkhsadfj,';",
                                    headers=get_auth_header())
        self.assertEqual(response.status_code, 400)

        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "bad_request")

    def test_create_job_unknown_param(self):
        response = self.client.post('/job/job1', data='{"asd": true}',
                                    headers=get_auth_header())
        self.assertEqual(response.status_code, 400)

        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "invalid_job_params")

    def test_create_job_invalid_params(self):
        response = self.client.post('/job/job1',
                                    data='{"do_task2": "blabla"}',
                                    headers=get_auth_header())
        self.assertEqual(response.status_code, 400)

        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "invalid_job_params")

    def test_create_job_invalid_job_type(self):
        response = self.client.post('/job/foobarbaz',
                                    headers=get_auth_header())
        self.assertEqual(response.status_code, 404)

        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "unknown_job_type")
