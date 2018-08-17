import io
import os
import shutil
import unittest
from pathlib import Path

from run_service import app
from test.service.user.user_utils import get_auth_header, test_user

parent_folder = 'files'
test_object = 'some_tiffs'
test_file = 'test.tif'


class StagingControllerTest(unittest.TestCase):
    resource_dir = os.environ['RESOURCE_DIR']
    staging_dir = os.environ['STAGING_DIR']

    def setUp(self):
        self.client = app.test_client()

    def tearDown(self):
        object_path = os.path.join(self.resource_dir, parent_folder, test_object)
        for file_name in os.listdir(object_path):
            self._remove_file_from_staging(file_name)
        self._remove_file_from_staging(test_file)
        self._remove_dir_from_staging(test_object)

    def test_upload_single_file(self):
        file_path = os.path.join(self.resource_dir, parent_folder,
                                 test_object, test_file)
        file = False
        try:
            file = (open(file_path, 'rb'), test_file)
            response = self._upload_to_staging({'file': file})
            self.assertEqual(response.status_code, 200)
            json = response.get_json()
            found_file_in_response = False
            for key in json['result']:
                if key == file[1]:
                    found_file_in_response = True
            self.assertTrue(found_file_in_response)
            self._assert_file_in_staging(test_file)
        finally:
            if file:
                file[0].close()

    def test_upload_multiple_files(self):
        object_path = os.path.join(self.resource_dir, parent_folder, test_object)
        response = self._upload_folder_to_staging(test_object)
        self.assertEqual(response.status_code, 200)
        self._assert_file_in_staging(os.path.join(test_object, test_file))
        for file_name in os.listdir(object_path):
            file_path = os.path.join(test_object, file_name)
            if os.path.isfile(file_path):
                self._assert_file_in_staging(file_path)

    def test_upload_file_extension_not_allowed(self):
        response = self._upload_to_staging(
            {'file': (io.BytesIO(b'asdf'), 'foo.asdf')})
        json = response.get_json()
        self.assertEqual(json["result"]['foo.asdf']["error"]["code"],
                         "extension_not_allowed")
        self.assertEqual(response.status_code, 200)

    def test_upload_file_no_files_provided(self):
        response = self._upload_to_staging({})
        self.assertEqual(response.status_code, 400)

        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "no_files_provided")

    def test_list_staging(self):
        object_path = os.path.join(self.resource_dir, parent_folder, test_object)
        file_names = os.listdir(object_path)
        self._upload_folder_to_staging(test_object)

        response = self.client.get('/staging', headers=get_auth_header())
        response_object = response.get_json()
        self.assertEqual(response_object[0]['name'], 'some_tiffs')
        contents = response_object[0]['contents']
        self.assertEqual(len(contents), len(file_names))

    def test_get_file(self):
        self._copy_object_to_staging(parent_folder, test_object)
        response = self.client.get(f'/staging/{test_object}/{test_file}',
                                   headers=get_auth_header())
        self.assertEqual(response.status_code, 200)

    def test_get_file_not_found(self):
        response = self.client.get(f'/staging/{test_object}/{test_file}',
                                   headers=get_auth_header())
        self.assertEqual(response.status_code, 404)

        response_json = response.get_json()
        self.assertFalse(response_json['success'])
        self.assertEqual(response_json['error']['code'], "file_not_found")

    def _upload_folder_to_staging(self, obj):
        object_path = os.path.join(self.resource_dir, parent_folder, obj)
        files = []
        file_paths = []
        for root, _, file_names in os.walk(object_path):
            for file in file_names:
                file_paths.append(os.path.join(root, file))
        try:
            for path in file_paths:
                if os.path.isfile(path):
                    relpath = os.path.relpath(path,os.path.dirname(object_path))
                    file = (open(path, 'rb'), relpath)
                    files.append(file)
            return self._upload_to_staging({'files': files})
        finally:
            for file in files:
                file[0].close()

    def _upload_to_staging(self, data):
        return self.client.post(
            '/staging',
            content_type='multipart/form-data',
            data=data,
            headers=get_auth_header()
        )

    def _assert_file_in_staging(self, file_path):
        file = Path(os.path.join(self.staging_dir, test_user, file_path))
        if not file.is_file():
            raise AssertionError(f"File '{file_path}' was not present in the "
                                 f"staging folder")

    def _remove_file_from_staging(self, file_name):
        file_path = os.path.join(self.staging_dir, test_user, file_name)
        if os.path.isfile(file_path):
            os.remove(file_path)

    def _remove_dir_from_staging(self, dir_name):
        dir_path = os.path.join(self.staging_dir, test_user, dir_name)
        shutil.rmtree(dir_path, ignore_errors=True)

    def _copy_object_to_staging(self, folder, filename):
        source = os.path.join(self.resource_dir, folder, filename)
        target = os.path.join(self.staging_dir, test_user, filename)
        shutil.copytree(source, target)
