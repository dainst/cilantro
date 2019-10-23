import unittest
import os

from workers.default.atom.atom_api import create_digital_object
from utils.object import Object


class CreateDigitalObjectTest(unittest.TestCase):

    resource_dir = os.environ['TEST_RESOURCE_DIR']

    def test_create_digital_object(self):
        obj = Object(f'{self.resource_dir}/objects/a_book')
        create_digital_object(obj)
