import os

from utils.celery_client import celery_app
from workers.base_task import FileTask
from workers.default.image.image_scaling import scale_image


class ScaleImageTask(FileTask):
    """
    Create copies of image files with new proportions while keeping ratio.

    TaskParams:
    -str image_max_width: width of the generated image file
    -str image_max_height: height of the generated image file

    Preconditions:
    - image files existing in format JPEG or TIFF

    Creates:
    - scaled copies of images
    """

    name = "image.scaling"

    def process_file(self, file, target_dir):
        """Read parameters and call the actual function."""
        new_width = int(self.get_param('max_width'))
        new_height = int(self.get_param('max_height'))
        try:
            target_dir = os.path.join(os.path.dirname(self.get_work_path()),
                                      self.get_param('target_dir'))
        except KeyError:
            target_dir = os.path.join(target_dir,
                                      f"scaled_{new_width}_{new_height}")

        file_name = os.path.splitext(os.path.basename(file))[0]
        file_extension = os.path.splitext(os.path.basename(file))[1]
        new_file_name = f"{file_name}_{new_width}_{new_height}{file_extension}"

        # create sub directory for scaled images
        os.makedirs(target_dir, exist_ok=True)

        scale_image(file, os.path.join(target_dir, new_file_name),
                    new_width, new_height)


ScaleImageTask = celery_app.register_task(ScaleImageTask())
