import os
import shutil
import unittest

from flask import json
from run_service import app

test_object = 'pdf'
test_file = 'e2e-testing.pdf'


class RepositoryControllerTest(unittest.TestCase):

    resource_dir = os.environ['RESOURCE_DIR']
    repository_dir = os.environ['REPOSITORY_DIR']

    def setUp(self):
        try:
            os.makedirs(self.repository_dir)
        except OSError:
            pass

        self._copy_object_to_repository('objects', test_object)

        app.testing = True
        self.client = app.test_client()

    def tearDown(self):
        shutil.rmtree(os.path.join(self.repository_dir, test_object))

    def _copy_object_to_repository(self, folder, object_id):
        source = os.path.join(self.resource_dir, folder, object_id)
        target = os.path.join(self.repository_dir, object_id)
        shutil.copytree(source, target)

    def _get(self, path):
        response = self.client.get(path)
        return json.loads(response.get_data(as_text=True))

    def test_list_root(self):
        data = self._get('/repository')
        self.assertIsInstance(data, list)
        self.assertIn(test_object, data)

    def test_list_dir(self):
        data = self._get(f'/repository/{test_object}')
        self.assertIsInstance(data, list)
        self.assertIn(test_file, data)

    def test_get_file(self):
        response = self.client.get(f'/repository/{test_object}/{test_file}')
        self.assertEqual(response.status_code, 200)

    def test_get_file_not_found(self):
        response = self.client.get(f'/repository/{test_object}/not_{test_file}')
        self.assertEqual(response.status_code, 404)
