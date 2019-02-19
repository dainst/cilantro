import unittest

from utils.repository import generate_repository_path


class RepositoryTest(unittest.TestCase):
    def test_generate_repository_path(self):
        self._compare_paths("foo", "ac/bd/foo")

    def test_generate_repository_path_with_subobject(self):
        self._compare_paths("bar/part_0001", "37/b5/bar/parts/part_0001")

    def test_generate_repository_path_with_multiple_subobjects(self):
        self._compare_paths("buz/part_0001/part_0001",
                            "2f/bf/buz/parts/part_0001/parts/part_0001")

    def _compare_paths(self, object_id, expected_path):
        path = generate_repository_path(object_id)
        self.assertEqual(path, expected_path)
