import unittest

from run_service import app
from test.service.user.user_utils import get_auth_header


class JobControllerTest(unittest.TestCase):

    def setUp(self):
        app.testing = True
        self.client = app.test_client()

    def test_create_job_success(self):
        response = self.client.post('/job/ingest_journal',
                                    headers=get_auth_header())
        self.assertEqual(response.status_code, 202)
        response_json = response.get_json()
        self.assertEqual(response_json['status'], 'Accepted')

    def test_create_job_invalid_json(self):
        response = self.client.post('/job/ingest_journal', data="jkhsadfj,';",
                                    headers=get_auth_header())
        self.assertEqual(response.status_code, 400)

        response_json = response.get_json()
        print(f"RESPONSE: {response_json}")
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "bad_request")

    def test_create_job_unknown_param(self):
        response = self.client.post('/job/ingest_journal', data='{"asd": true}',
                                    headers=get_auth_header())
        self.assertEqual(response.status_code, 400)

        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "invalid_job_params")

    def test_create_job_invalid_params(self):
        response = self.client.post('/job/ingest_journal',
                                    data='{"split_files": true}',
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
