import os

from workers.default.xml.xml_generator import generate_xml
from utils.object import Object


def generate_marc_xml(obj: Object, template):
    """
    Merges article data with the journal data, then calls the
    generic generate_xml function for all articles.
    :param Object obj: the object on which to generate the xml
    :param str template: Marc-XML template
    :return: None
    """
    generate_xml(obj.path,
                 obj.metadata.get_json(),
                 template,
                 "marc.xml")
    for part in obj.get_children():
        generate_xml(part.path,
                     part.metadata.get_json(),
                     template,
                     "marc.xml")
