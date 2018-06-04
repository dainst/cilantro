import logging
import os
from string import Template

log = logging.getLogger(__name__)


def generate_marcxml(data, target_path):
    """
    Create XML file for MARC standard. The XML is built by substituting values
    in the data.json file into a template file.
    One marcXML file is generated for every article the the journal (data.json).
    :param dict data: JSON file which contains the data to fill the marc-XML
        template
    :param str target_path: directory to put the generated file
    """

    journal_data = data['data']

    for article in data['articles']:
        # build some variables needed in the template
        # also substitute cannot handle a nested dict, so nested data is merged in
        article['main_author'] = article['author'][0]['firstname'] + ' ' + article['author'][0]['lastname']
        article['author_list'] = ', '.join(_assemble_author_list(article))

        template = _read_template_file().substitute({**journal_data, **article, **article['pages']})
        _write_template_to_file(template, target_path, article['title'].replace(' ', '_') + ".xml")


def _assemble_author_list(article):
    author_list = []
    for author in article['author']:
        author_list.append(f"{author['firstname']} {author['lastname']}")
    return author_list


def _read_template_file():
    my_path = os.path.abspath(os.path.dirname(__file__))
    path = "resources/marc.xml.template"

    template_file = open(path, 'r')
    template = Template(template_file.read())
    template_file.close()

    return template


def _write_template_to_file(template, target_path, target_file_name):
    log.debug("saving to" + os.path.join(target_path, target_file_name))
    text_file = open(os.path.join(target_path, target_file_name), "w")
    text_file.write(template)
    text_file.close()
