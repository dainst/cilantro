import os
import shutil
import unittest

from utils.list_dir import list_dir


class ListDirTest(unittest.TestCase):
    working_dir = os.environ['WORKING_DIR']
    resource_dir = os.environ['TEST_RESOURCE_DIR']
    test_dir = 'test_list_dir'
    target_dir = os.path.join(working_dir, test_dir)
    target_contents = ['foo.txt', 'test1.txt', 'test2.txt', 'test11.txt']

    def setUp(self):
        os.makedirs(self.working_dir, exist_ok=True)
        source = os.path.join(self.resource_dir, 'directories', self.test_dir)
        shutil.copytree(source, self.target_dir)

    def tearDown(self):
        shutil.rmtree(self.target_dir)

    def test_list_dir(self):
        res = list_dir(self.target_dir)
        self.assertEqual(set(res), set(self.target_contents))

    def test_list_dir_sorted(self):
        res = list_dir(self.target_dir, sorted=True)
        self.assertEqual(res, self.target_contents)

    def test_list_dir_unknown_dir(self):
        with self.assertRaises(FileNotFoundError):
            list_dir('foo')

    def test_list_dir_unknown_dir_ignore_not_found(self):
        res = list_dir(self.target_dir, ignore_not_found=True)
        self.assertEqual(set(res), set(self.target_contents))
