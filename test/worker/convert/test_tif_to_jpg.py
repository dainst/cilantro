import os
import unittest
import logging
from pathlib import Path

from workers.convert.convert_image import convert_tif_to_jpg

log = logging.getLogger(__name__)


class TifToJpgTest(unittest.TestCase):
    resource_dir = os.environ['RESOURCE_DIR']
    working_dir = os.environ['WORKING_DIR']
    tif_path = f'{resource_dir}/files/test.tif'
    broken_tif_path = f'{resource_dir}/files/broken.tif'
    jpg_path = f'{working_dir}/test.jpg'

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
