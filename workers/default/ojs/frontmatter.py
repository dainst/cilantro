from utils.ojs_api import generate_frontmatters


def generate_frontmatter(article_id_list):
    """
    Generate frontmatter page for articles in OJS via Frontmatter-Plugin.

    The given id_list is merged by commata.

    For further details see OJS API module.

    :param article_id_list: IDs of documents in OJS
    :return: tuple containing the response code and text
    """
    ids = ','.join(map(str, article_id_list))

    return generate_frontmatters(ids)
