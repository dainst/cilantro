import os
import unittest
from pathlib import Path
from convert.converter import convert_tif2jpg


class Tif2JpgTest(unittest.TestCase):

    tif_path = 'test/resources/objects/some_tiffs/test.tif'
    jpg_path = 'test/resources/objects/some_tiffs/test.jpg'

    def test_success(self):
        convert_tif2jpg(self.tif_path, self.jpg_path)
        self.assertTrue(Path(self.jpg_path).is_file())
        stat = os.stat(self.jpg_path)
        self.assertGreater(stat.st_size, 0)

    def tearDown(self):
        os.remove(self.jpg_path)
