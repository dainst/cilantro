import unittest
import os

from run_service import app

from flask import json

config_dir = os.environ['CONFIG_DIR']
job_types_dir = os.path.join(config_dir, 'job_types')


class JobTypeTest(unittest.TestCase):

    def setUp(self):
        app.testing = True
        self.client = app.test_client()

    def test_job_types_list_length(self):
        """
        Checks if the length of the element list of what the API returns is
        the same than the number of files in the directory on disk.

        :return: None
        """
        job_types_from_files = []
        for job_type in os.listdir(job_types_dir):
            job_types_from_files.append(job_type.rsplit('.', 1)[0])

        response = self.client.get('/job_types')

        self.assertEqual(len(job_types_from_files), len(response.get_json()))

    def test_first_job_types_exists(self):
        """
        Checks if the first filename from the job type directory is present
        in the JSON returned by the API.

        :return: None
        """
        first_job_type_name = os.listdir(job_types_dir)[0].rsplit('.', 1)[0]
        response_text = self.client.get('/job_types').get_data(as_text=True)

        self.assertIn(first_job_type_name, response_text)
