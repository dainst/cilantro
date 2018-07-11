import os
import shutil
import unittest


class ConvertTest(unittest.TestCase):
    """
    Base class for conversion tests

    Ensures the test working dir is created before and removed after each test.

    Make sure to explicitly call super().setUp() and super().tearDown() if
    you need to extend these methods.
    """
    resource_dir = os.environ['RESOURCE_DIR']
    working_dir = "test_data"

    def setUp(self):
        try:
            os.makedirs(self.working_dir)
        except OSError:
            pass

    def tearDown(self):
        try:
            shutil.rmtree(self.working_dir)
        except OSError:
            pass
