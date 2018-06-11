import os
import unittest
import logging

from pathlib import Path
from worker.convert.converter import convert_tif_to_jpg


log = logging.getLogger(__name__)


class TifToJpgTest(unittest.TestCase):

    tif_path = 'test/resources/objects/some_tiffs/test.tif'
    broken_tif_path = 'test/resources/objects/test_object/image1.tif'
    jpg_path = 'test/resources/objects/some_tiffs/test.jpg'

    def test_success(self):
        convert_tif_to_jpg(self.tif_path, self.jpg_path)
        self.assertTrue(Path(self.jpg_path).is_file())
        stat = os.stat(self.jpg_path)
        self.assertGreater(stat.st_size, 0)

    def test_error(self):
        self.assertRaises(OSError, convert_tif_to_jpg, self.broken_tif_path, self.jpg_path)

    @classmethod
    def tearDownClass(cls):
        try:
            os.remove(cls.jpg_path)
            log.debug("Deleted file: " + cls.jpg_path)
        except FileNotFoundError as e:
            log.error("File not found: " + e.filename)
