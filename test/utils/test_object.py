import os
import shutil
import unittest

from utils.object import Object

working_dir = os.environ['WORKING_DIR']
resource_dir = os.environ['RESOURCE_DIR']
test_object_name = "test_object"
test_object_working_path = os.path.join(working_dir, test_object_name)
test_object_resource_path = os.path.join(resource_dir, test_object_name)


def _copy_test_object():
    shutil.copytree(test_object_resource_path, test_object_working_path)


class ObjectTest(unittest.TestCase):

    def test_init(self):
        o = Object(test_object_working_path)
        self.assertTrue(os.path.isdir(test_object_working_path))
        meta_path = os.path.join(test_object_working_path, 'meta.json')
        self.assertTrue(os.path.isfile(meta_path))
        self.assertIsInstance(o.metadata, dict)
        self.assertEquals(o.metadata, {})

    def test_read(self):
        _copy_test_object()
        o = Object.read(test_object_resource_path)
        self.assertIsInstance(o.metadata, dict)
