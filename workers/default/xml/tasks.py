import os

from utils.celery_client import celery_app

from workers.base_task import ObjectTask
from workers.default.xml.xml_generator import generate_xml
from workers.default.xml.xml_validator import validate_xml
from utils.object import Object


class GenerateXMLTask(ObjectTask):
    """
    Generate an XML based on a data.json file and validate it.

    The parameter xml_type makes the function use the right template
    and target file name.

    TaskParams:
    -str xml_type: name of the type of XML to be generated

    Preconditions:
    -data.json in the working dir

    Creates:
    -ojs_import.xml
    """

    name = "generate_xml"

    def process_object(self, obj):
        xml_type = self.get_param('xml_type')

        if xml_type == 'ojs':
            xml_template_string = _read_file('resources/ojs_template.xml')
            target_filename = 'ojs_import.xml'
            dtd_file = 'resources/ojs_import.dtd'
            schema_file = None
        elif xml_type == 'marc':
            xml_template_string = _read_file('resources/marc_template.xml')
            target_filename = 'marc.xml'
            dtd_file = None
            schema_file = 'resources/MARC21slim.xsd'
        else:
            raise ValueError(f"Unknown XML type: {{xml_type}}")

        data = {
            'metadata': obj.metadata.to_dict()
            }

        # parts mean that this is an issue, and not an article
        if any(obj.get_parts()):
            articles_meta = []
            # add filepath to article data, which is needed in the XML
            for part in obj.get_parts():
                articles_meta.append({
                    **part.metadata.to_dict(),
                    'filepath': os.path.join(part.get_representation_dir(
                                             Object.INITIAL_REPRESENTATION),
                                             'merged.pdf')  # TODO filename may be different?
                    })

            data['ojs_metadata'] = self.get_param('ojs_metadata')
            data['articles'] = articles_meta

        generated_xml_file = generate_xml(obj.path, data, xml_template_string,
                                          target_filename)

        validate_xml(generated_xml_file, dtd_file_path=dtd_file,
                     schema_file_path=schema_file)


GenerateXMLTask = celery_app.register_task(GenerateXMLTask())


def _read_file(path):
    template_file = open(path, 'r')
    template_string = template_file.read()
    template_file.close()

    return template_string
