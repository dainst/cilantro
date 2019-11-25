import unittest

from utils.repository import generate_repository_path


class RepositoryTest(unittest.TestCase):
    def test_generate_repository_path(self):
        self._compare_paths("foo_1234", "1200/1234/foo_1234")

    def _compare_paths(self, object_id, expected_path):
        path = generate_repository_path(object_id)
        self.assertEqual(path, expected_path)
