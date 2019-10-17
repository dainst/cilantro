import os
import shutil
import unittest
import logging
from filecmp import dircmp
from io import BytesIO

from utils.object import Object, ObjectMetadata

working_dir = os.environ['WORKING_DIR']
resource_dir = os.environ['TEST_RESOURCE_DIR']
test_object_name = 'a_book_1234'
test_object_working_path = os.path.join(working_dir, test_object_name)
test_object_resource_path = os.path.join(resource_dir, 'objects',
                                         test_object_name)
test_file_name = 'test.jpg'
test_file_path = os.path.join(resource_dir, 'files', test_file_name)
test_metadata_file_name = 'marc.xml'
test_metadata_file_path = os.path.join(resource_dir, 'files',
                                       test_metadata_file_name)
copy_working_path = os.path.join(working_dir, 'a_copy')

log = logging.getLogger(__name__)


def _copy_test_object():
    shutil.copytree(test_object_resource_path, test_object_working_path)


class ObjectTest(unittest.TestCase):

    def tearDown(self):
        try:
            shutil.rmtree(test_object_working_path)
            shutil.rmtree(copy_working_path)
        except FileNotFoundError as error:
            log.debug(error)

    def test_init(self):
        obj = Object(test_object_working_path)

        self.assertIsInstance(obj.metadata, ObjectMetadata)
        self.assertEqual(obj.metadata.to_json(), '{}')

    def test_read(self):
        _copy_test_object()
        obj = Object(test_object_working_path)
        self.assertIsInstance(obj.metadata, ObjectMetadata)
        self.assertEqual(obj.metadata.creator.firstname, "Peter")

    def test_write(self):
        obj = Object(test_object_working_path)
        obj.metadata.title = "A test object"
        obj.write()

        self.assertTrue(os.path.isdir(test_object_working_path))
        meta_path = os.path.join(test_object_working_path, 'meta.json')
        self.assertTrue(os.path.isfile(meta_path))

    def test_add_stream(self):
        obj = Object(test_object_working_path)
        obj.metadata.title = "A test object"
        stream = open(test_file_path, 'rb')
        obj.add_stream(os.path.basename(test_file_path), 'jpg',
                       BytesIO(stream.read()))
        obj.write()
        stream.close()

        expected_file_path = os.path.join(test_object_working_path, 'data',
                                          'jpg', test_file_name)
        self.assertTrue(os.path.isfile(expected_file_path))

    def test_add_file(self):
        obj = Object(test_object_working_path)
        obj.metadata.title = "A test object"
        obj.add_file('jpg', test_file_path)
        obj.write()

        expected_file_path = os.path.join(test_object_working_path, 'data',
                                          'jpg', test_file_name)
        self.assertTrue(os.path.isfile(expected_file_path))

    def test_list_representations(self):
        _copy_test_object()
        obj = Object(test_object_working_path)
        representations = obj.list_representations()

        self.assertEqual(len(representations), 2)
        self.assertEqual(representations[0], 'jpg')

    def test_get_representation(self):
        _copy_test_object()
        obj = Object(test_object_working_path)

        files = obj.get_representation('pdf')
        file = files.__next__()
        self.assertIsInstance(file, BytesIO)
        self.assertGreater(file.getbuffer().nbytes, 0)

    def test_copy(self):
        _copy_test_object()
        obj = Object(test_object_working_path)
        obj.copy(copy_working_path)

        comparison = dircmp(test_object_working_path, copy_working_path)
        self.assertFalse(comparison.left_only)
        self.assertFalse(comparison.right_only)
        self.assertFalse(comparison.diff_files)
