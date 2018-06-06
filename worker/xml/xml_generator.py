import logging
import os
import json

from jinja2 import Template

log = logging.getLogger(__name__)


def generate_xml(work_path, data=None, xml_type='marc'):
    """
    Main function for XML-Generation. Uses json file as parameters for the XML template and writes the generated files
    to the working directory.
    :param work_path: Directory of the job
    :param data: XML metadata
    :param xml_type: used to choose the template file - either marc or ojs
    :return: None
    """
    data = data or _load_json_data(work_path)
    template = _read_template_file(xml_type)
    if xml_type == 'marc':
        prepared_data = _prepare_marc_data(data)
        for article in prepared_data:
            filled_template = template.render(article)
            _write_template_to_file(filled_template,
                                    work_path,
                                    article['title'].replace(' ', '_') + ".xml")
    else:
        prepared_data = _prepare_ojs_data(data)
        filled_template = template.render(prepared_data)
        _write_template_to_file(filled_template, work_path, 'ojs_import.xml')


def _load_json_data(work_path):
    json_path = os.path.join(work_path, 'data_json/data.json')
    with open(json_path) as data_object:
        data = json.load(data_object)
    return data


def _read_template_file(template_type='marc'):
    path = "resources/" + template_type + "_template.xml"
    template_file = open(path, 'r')
    template = Template(template_file.read(), trim_blocks=True, lstrip_blocks=True)
    template_file.close()

    return template


def _write_template_to_file(template, target_path, target_file_name):
    log.debug("Saving XML file to" + os.path.join(target_path, target_file_name))
    text_file = open(os.path.join(target_path, target_file_name), "w")
    text_file.write(str(template))
    text_file.close()


def _prepare_marc_data(data):
    """
    Build some variables needed in the marc XML template.
    :param dict data: JSON file which contains the data to fill the marc-XML
    :return: list of articles with all the data on the top level
    """
    prepared_article_list = []

    journal_data = data['data']

    for article in data['articles']:
        article['main_author'] = article['author'][0]['firstname'] + ' ' + article['author'][0]['lastname']
        article['author_list'] = ', '.join(_assemble_author_list(article))
        del article['author']  # remove unused stuff
        prepared_article_list.append({**journal_data, **article, **article['pages']})

    return prepared_article_list


def _prepare_ojs_data(data):
    """
    Build variables for the OJS XML template
    :param dict data: JSON file which contains the data to fill the XML
    :return: dict expanded json data
    """
    for article in data['articles']:
        article['locale'] = 'language="' + article['language'][0:2] +\
                            '" locale="' + article['language'] + '"'\
                            or ''
        if article['zenonId'] == '(((new)))':
            article['zenonId'] = ''
        article['pages_new'] = article['pages']['showndesc'] + ('#DFM' if article['createFrontpage'] else '')

    return data


def _assemble_author_list(article):
    author_list = []
    for author in article['author']:
        author_list.append(f"{author['firstname']} {author['lastname']}")
    return author_list
