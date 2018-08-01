from workers.default.xml.xml_generator import generate_xml
from utils.object import Object


def generate_marc_xml(obj: Object, template, target_filename='marc.xml'):
    """
    Merges article data with the journal data, then calls the
    generic generate_xml function for all articles.
    :param Object obj: the object on which to generate the xml
    :param str template: Marc-XML template
    :param str target_filename: name of the generated file
    :return: None
    """

    for part in obj.get_children():
        data = {**part.metadata.to_dict(), **obj.metadata.to_dict()}
        generate_xml(part.path,
                     data,
                     template,
                     target_filename)
