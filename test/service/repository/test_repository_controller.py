import os
import shutil
import unittest
from flask import json
from run_service import app


class RepositoryControllerTest(unittest.TestCase):

    resource_dir = os.environ['RESOURCE_DIR']
    repository_dir = os.environ['REPOSITORY_DIR']

    def setUp(self):
        try:
            os.makedirs(self.repository_dir)
        except OSError:
            pass

        self._copy_object_to_repository('objects', 'some_tiffs')

        app.testing = True
        self.client = app.test_client()

    def _copy_object_to_repository(self, folder, object_id):
        source = os.path.join(self.resource_dir, folder, object_id)
        target = os.path.join(self.repository_dir, object_id)
        try:
            shutil.copytree(source, target)
        except FileExistsError:
            pass

    def _get(self, path):
        response = self.client.get(path)
        return json.loads(response.get_data(as_text=True))

    def test_list_root(self):
        data = self._get('/repository')
        self.assertIsInstance(data, list)
        self.assertIn('some_tiffs', data)
