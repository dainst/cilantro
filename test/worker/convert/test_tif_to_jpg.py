import os
import logging
from pathlib import Path

from test.worker.convert.convert_test import ConvertTest
from workers.convert.convert_image import convert_tif_to_jpg

log = logging.getLogger(__name__)


class TifToJpgTest(ConvertTest):

    def setUp(self):
        super().setUp()
        self.tif_path = f'{self.resource_dir}/files/test.tif'
        self.broken_tif_path = f'{self.resource_dir}/files/broken.tif'
        self.jpg_path = f'{self.working_dir}/test.jpg'

    def test_success(self):
        convert_tif_to_jpg(self.tif_path, self.jpg_path)
        self.assertTrue(Path(self.jpg_path).is_file())
        stat = os.stat(self.jpg_path)
        self.assertGreater(stat.st_size, 0)

    def test_error(self):
        self.assertRaises(OSError, convert_tif_to_jpg, self.broken_tif_path,
                          self.jpg_path)
