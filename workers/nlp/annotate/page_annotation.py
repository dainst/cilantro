
from workers.nlp.formats.xmi import Annotation, DaiNlpXmiBuilder


def annotate_pages(pages: [str]) -> str:
    """
    Takes an array of pages and turns them into an XMI document
    that conforms to the DAI NLP typesystem.

    The SofA of the resulting document is the concatenated text
    of the pages. Each page range is marked up as an annotation
    in the document.

    :param list pages: The pages as a list of strings.
    :return str: The xmi document as an xml string.
    """
    text = ''.join(pages)
    builder = DaiNlpXmiBuilder("page-annotator")
    builder.set_sofa(text)

    page_start = 0
    page_no = 1
    for page in pages:
        page_end = page_start + len(page)
        builder.add_annotation(Annotation.page, start=page_start, end=page_end, number=page_no)
        page_start = page_end
        page_no += 1

    return builder.xmi()
