import os
import shutil
import unittest
from filecmp import dircmp
from io import BytesIO

from utils.object import Object, ObjectMetadata

working_dir = os.environ['WORKING_DIR']
resource_dir = os.environ['RESOURCE_DIR']
test_object_name = 'a_book'
test_object_working_path = os.path.join(working_dir, test_object_name)
test_object_resource_path = os.path.join(resource_dir, 'objects',
                                         test_object_name)
test_file_name = 'test.jpg'
test_file_path = os.path.join(resource_dir, 'files', test_file_name)
test_metadata_file_name = 'marc.xml'
test_metadata_file_path = os.path.join(resource_dir, 'files', test_metadata_file_name)
copy_working_path = os.path.join(working_dir, 'a_copy')


def _copy_test_object():
    shutil.copytree(test_object_resource_path, test_object_working_path)


class ObjectTest(unittest.TestCase):

    def tearDown(self):
        try:
            shutil.rmtree(test_object_working_path)
            shutil.rmtree(copy_working_path)
        except FileNotFoundError:
            pass

    def test_init(self):
        obj = Object(test_object_working_path)

        self.assertIsInstance(obj.metadata, ObjectMetadata)
        self.assertEqual(obj.metadata.get_json(), '{}')

    def test_read(self):
        _copy_test_object()
        obj = Object.read(test_object_working_path)
        self.assertIsInstance(obj.metadata, ObjectMetadata)
        self.assertEqual(obj.metadata.creator.firstname, "Peter")

    def test_write(self):
        obj = Object(test_object_working_path)
        obj.metadata.title = "A test object"
        obj.write()

        self.assertTrue(os.path.isdir(test_object_working_path))
        meta_path = os.path.join(test_object_working_path, 'meta.json')
        self.assertTrue(os.path.isfile(meta_path))

    def test_add_file(self):
        obj = Object(test_object_working_path)
        obj.metadata.title = "A test object"
        stream = open(test_file_path, 'rb')
        obj.add_file(os.path.basename(test_file_path), 'jpg', BytesIO(stream.read()))
        obj.write()
        stream.close()

        expected_file_path = os.path.join(test_object_working_path, 'data',
                                          'jpg', test_file_name)
        self.assertTrue(os.path.isfile(expected_file_path))
        meta_path = os.path.join(test_object_working_path, 'meta.json')
        self.assertTrue(os.path.isfile(meta_path))

    def test_list_representations(self):
        _copy_test_object()
        obj = Object.read(test_object_working_path)
        representations = obj.list_representations()

        self.assertEqual(len(representations), 2)
        self.assertEqual(representations[0], 'jpg')

    def test_get_representation(self):
        _copy_test_object()
        obj = Object.read(test_object_working_path)

        files = obj.get_representation('pdf')
        file = files.__next__()
        self.assertIsInstance(file, BytesIO)
        self.assertGreater(file.getbuffer().nbytes, 0)

    def test_write_metadata_file(self):
        obj = Object(test_object_working_path)
        stream = open(test_metadata_file_path, "r")
        obj.write_metadata_file(
            test_metadata_file_name,
            stream
        )
        stream.close()
        expected_file_path = os.path.join(test_object_working_path,
                                          test_metadata_file_name)
        self.assertTrue(os.path.isfile(expected_file_path))

    def test_add_child(self):
        obj = Object(test_object_working_path)
        subobj = obj.add_child()
        subobj.metadata.title = "A test object"
        with open(test_file_path, 'rb') as file:
            subobj.add_file(os.path.basename(test_file_path), 'jpg', file)
        obj.write()

        expected_file_path = os.path.join(test_object_working_path, 'parts',
                                          'part_0001', 'data', 'jpg',
                                          test_file_name)
        self.assertTrue(os.path.isfile(expected_file_path))
        meta_path = os.path.join(test_object_working_path, 'parts',
                                 'part_0001', 'meta.json')
        self.assertTrue(os.path.isfile(meta_path))

    def test_get_children(self):
        _copy_test_object()
        obj = Object.read(test_object_working_path)
        children = obj.get_children()
        subobj = children.__next__()
        file = subobj.get_representation('jpg').__next__()
        self.assertIsInstance(file, BytesIO)
        self.assertGreater(file.getbuffer().nbytes, 0)

        subobj = children.__next__()
        self.assertIsInstance(subobj.metadata, ObjectMetadata)
        self.assertEqual(subobj.metadata.title, "[Attic geometric Pyxis].")

    def test_copy(self):
        _copy_test_object()
        obj = Object.read(test_object_working_path)
        obj.copy(copy_working_path)

        comparison = dircmp(test_object_working_path, copy_working_path)
        self.assertFalse(comparison.left_only)
        self.assertFalse(comparison.right_only)
        self.assertFalse(comparison.diff_files)
