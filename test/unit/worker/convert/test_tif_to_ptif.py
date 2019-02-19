import os
from pathlib import Path

from test.unit.worker.convert.convert_test import ConvertTest
from workers.convert.convert_image import convert_tif_to_ptif


class TifToPTifTest(ConvertTest):
    """Test conversion of TIFF to PTIFF using imagemagick shell command."""

    def setUp(self):
        """Test preparation by setting up needed paths."""
        super().setUp()
        self.tif_path = f'{self.resource_dir}/files/test.tif'
        self.broken_tif_path = f'{self.resource_dir}/files/broken.tif'
        self.ptif_path = f'{self.working_dir}/test.ptif'

    def test_success(self):
        convert_tif_to_ptif(self.tif_path, os.path.dirname(self.ptif_path))
        self.assertTrue(Path(self.ptif_path).is_file())
        stat = os.stat(self.ptif_path)
        self.assertGreater(stat.st_size, 0)

    def test_error(self):
        """Test error case with faulty source TIFF."""
        self.assertRaises(OSError, convert_tif_to_ptif, self.broken_tif_path,
                          self.ptif_path)
