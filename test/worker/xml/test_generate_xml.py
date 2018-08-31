import unittest
import os
import logging

from workers.default.xml.xml_generator import generate_xml
from utils.object import Object
from workers.base_task import ObjectTask

log = logging.getLogger(__name__)


class GenerateXMLTest(unittest.TestCase):

        resource_dir = os.environ['RESOURCE_DIR']
        working_dir = os.environ['WORKING_DIR']

        def test_generate_ojsxml(self):
            obj = Object(f'{self.resource_dir}/objects/a_journal')
            template_file = 'ojs_template.xml'
            target_file_path = os.path.join(obj.path, 'test_ojsxml.xml')
            task = ObjectTask()
            task.params['ojs_metadata'] = {
                "ojs_journal_code": "test",
                "ojs_user": "ojs_user",
                "auto_publish_issue": False,
                "default_publish_articles": True,
                "default_create_frontpage": True,
                "allow_upload_without_file": False
            }

            generate_xml(task, obj, template_file, target_file_path)

            self.assertTrue(os.path.isfile(
                f'{self.resource_dir}/objects/a_journal/test_ojsxml.xml'))
            os.remove(f'{self.resource_dir}/objects/a_journal/test_ojsxml.xml')
