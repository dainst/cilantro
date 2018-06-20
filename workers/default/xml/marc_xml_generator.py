from workers.default.xml.xml_generator import generate_xml


def generate_marc_xml(work_path, data, template):
    """
    Merges the article data with the journal data for all articles. Then calls the generic generat_xml function
    for all articles.

    :param str work_path: Path to put the generated XML
    :param dict data: Journal metadata
    :param str template: Marc-XML template
    :return: None
    """
    for article in data['articles']:
        generate_xml(work_path,
                     {**data['data'], **article},
                     template,
                     article['title'].replace(' ', '_') + ".xml")
