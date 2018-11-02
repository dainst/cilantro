import unittest
import os

from workers.convert.image_scaling import scale_image


class ConvertImageTest(unittest.TestCase):
    """
    Test the image scaling functions.

    Basically just taking an existing image file, passing it to the function
    with arbitrary parameters and checking if another file was generated.
    """

    resource_dir = os.environ['RESOURCE_DIR']

    def test_scale_jpg(self):
        """Test scaling for JPEG type image."""
        image_file = os.path.join(self.resource_dir, 'files', 'test.jpg')
        scale_image(image_file,
                    os.path.join(self.resource_dir, 'test_30_40.jpg'), 30, 40)
        self.assertTrue(os.path.isfile(
            f'{self.resource_dir}/test_30_40.jpg'))
        os.remove(os.path.join(self.resource_dir, 'test_30_40.jpg'))

    def test_scale_tif(self):
        """Test scaling for TIF type image."""
        image_file = os.path.join(self.resource_dir, 'files', 'test.tif')
        scale_image(image_file,
                    os.path.join(self.resource_dir, 'test_30_40.tif'), 30, 40)
        self.assertTrue(os.path.isfile(
            f'{self.resource_dir}/test_30_40.tif'))
        os.remove(os.path.join(self.resource_dir, 'test_30_40.tif'))
