import os
import shutil
import unittest

from flask import json
from service.run_service import app
from utils.repository import generate_repository_path


test_object = 'a_archival_description_0001'
test_representation = 'pdf'
test_jpg = "test.jpg"
test_file = 'a_archival_description_0001.pdf'
test_metafile = 'meta.json'


class RepositoryControllerTest(unittest.TestCase):
    resource_dir = os.environ['TEST_RESOURCE_DIR']
    repository_dir = os.environ['REPOSITORY_DIR']

    def setUp(self):
        os.makedirs(self.repository_dir, exist_ok=True)

        self._copy_object_to_repository('objects', test_object)

        app.testing = True
        self.client = app.test_client()

    def tearDown(self):
        shutil.rmtree(os.path.join(self.repository_dir,
                                   generate_repository_path(test_object)))

    def _copy_object_to_repository(self, folder, object_id):
        source = os.path.join(self.resource_dir, folder, object_id)
        target = os.path.join(self.repository_dir,
                              generate_repository_path(object_id))
        shutil.copytree(source, target)

    def _get(self, path):
        response = self.client.get(path)
        return json.loads(response.get_data(as_text=True))

    def test_list_repository_root(self):
        """Test if prepared resources are available through endpoint."""
        response = self._get('/repository')
        self.assertIsInstance(response, list)
        self.assertIn(test_object, response)

    def test_get_object(self):
        response = self._get(f'/repository/object/{test_object}')
        self.assertIsInstance(response['metadata'], dict)
        self.assertIsInstance(response['representations'], list)

    def test_get_object_not_found(self):
        response = self.client.get(f'/repository/object/wrong_object_1234')
        self.assertEqual(response.status_code, 404)

        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "object_not_found")

    def test_get_representation(self):
        response = self._get(
            f'/repository/representation/{test_object}/{test_representation}')
        self.assertIsInstance(response, list)
        self.assertIn(test_file, response)

    def test_get_representation_not_found(self):
        response = self.client.get(
            f'/repository/representation/{test_object}/wrong_representation')
        self.assertEqual(response.status_code, 404)

        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'],
                         "representation_not_found")

    def test_get_file(self):
        response = self.client.get(
            f'/repository/file/{test_object}/data/{test_representation}/{test_file}')
        self.assertEqual(response.status_code, 200)

    def test_get_file_not_found(self):
        response = self.client.get(
            f'/repository/file/{test_object}/data/{test_representation}/wrong_file')
        self.assertEqual(response.status_code, 404)

        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "file_not_found")

    def test_get_metafile(self):
        response = self.client.get(
            f'/repository/file/{test_object}/{test_metafile}')
        self.assertEqual(response.status_code, 200)

    def test_get_metafile_not_found(self):
        response = self.client.get(
            f'/repository/file/{test_object}/wrong_metafile')
        self.assertEqual(response.status_code, 404)

        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "file_not_found")
