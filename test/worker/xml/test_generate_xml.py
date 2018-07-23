import unittest
import os
import logging

from workers.default.xml.xml_generator import generate_xml
from workers.default.xml.marc_xml_generator import generate_marc_xml
from utils.object import Object

log = logging.getLogger(__name__)


class GenerateXMLTest(unittest.TestCase):

        resource_dir = os.environ['RESOURCE_DIR']
        working_dir = os.environ['WORKING_DIR']

        def test_generate_marcxml(self):
            obj = Object(f'{self.resource_dir}/objects/a_journal')

            template_file = open('resources/marc_template.xml', 'r')
            template_string = template_file.read()
            template_file.close()

            generate_marc_xml(obj, template_string, 'test_marcxml.xml')

            self.assertTrue(os.path.isfile(f'{self.resource_dir}/objects/a_journal/parts/part_0001/test_marcxml.xml'))
            self.assertTrue(os.path.isfile(f'{self.resource_dir}/objects/a_journal/parts/part_0002/test_marcxml.xml'))
            os.remove(f'{self.resource_dir}/objects/a_journal/parts/part_0001/test_marcxml.xml')
            os.remove(f'{self.resource_dir}/objects/a_journal/parts/part_0002/test_marcxml.xml')

        def test_generate_ojsxml(self):
            obj = Object(f'{self.resource_dir}/objects/a_journal')

            template_file = open('resources/ojs_template.xml', 'r')
            template_string = template_file.read()
            template_file.close()

            articles_meta = []
            for part in obj.get_children():
                articles_meta.append(part.metadata.to_dict())

            data = {'data': {
                **obj.metadata.to_dict(),
                'auto_publish_issue': True,
                'default_create_frontpage': True,
            },
                'articles': articles_meta}

            generate_xml(obj.path, data, template_string, 'test_ojsxml.xml')

            self.assertTrue(os.path.isfile(f'{self.resource_dir}/objects/a_journal/test_ojsxml.xml'))
            os.remove(f'{self.resource_dir}/objects/a_journal/test_ojsxml.xml')
