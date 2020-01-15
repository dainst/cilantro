

import bs4
import logging
import json
import re

log = logging.getLogger(__name__)

class XMLTagPageGenerator(object):


    def __init__(self, xml_str, page_separator = "\f"):
        self.doc = bs4.BeautifulSoup(xml_str, "html.parser")
        self.page_boundaries = None
        self.page_separator = page_separator

    def _lazy_init_page_boundaries(self):
        if self.page_boundaries is None:
            regex = re.compile(self.page_separator)
            indices = [match.start() for match in regex.finditer(self.doc.text)]
            indices = [0] + indices + [len(self.doc.text)]
            self.page_boundaries = list(zip(indices, indices[1:]))
        return self.page_boundaries

    def _page(self, text_pos):
        for page_idx, (start, end) in enumerate(self._lazy_init_page_boundaries()):
            if start <= text_pos < end:
                return page_idx + 1
        raise ValueError(f"Text position not contained: {text_pos}")

    def _pages(self, text_pos_start, text_pos_end):
        page_range = range(self._page(text_pos_start), self._page(text_pos_end) + 1)
        return list(set(page_range))

    @classmethod
    def _iterate_tags_with_text_pos(cls, elem: bs4.Tag, text_pos: int = 0):
        new_pos = text_pos
        for child in elem.children:
            if type(child) is bs4.NavigableString:
                # count characters to the current text position
                new_pos += len(child)
            elif type(child) is bs4.Tag:
                yield (child, new_pos)
                # recurse to the child
                yield from cls._iterate_tags_with_text_pos(child, new_pos)
                # count text characters to the current text position (these will be counted
                # again one level deeper, but changes from there are not handed upwards.)
                new_pos += len(child.text)
            else:
                # do nothing on ProcessingInstructions, Doctypes, Comments etc.
                pass

    def iterate_tags_with_text_pos(self):
        """
        Depth-first iterates the tags contained in elem and yield them together
        with the text position at the start of the tag. (Only text in the document
        counts towards the text position, not xml-elements themselves.)

        Yields (bs4.Tag, int).
        """
        yield from self._iterate_tags_with_text_pos(self.doc, 0)

    def iterate_tags_with_pages(self):
        """
        Depth-first iterates the tags contained in elem and yield them together
        with a list of page numbers, on which the tag appears

        Yields (bs4.Tag, [int]).
        """
        for tag, start in self.iterate_tags_with_text_pos():
            end = start + len(tag.text)
            yield (tag, self._pages(start, end))



class Annotation(object):
    """
    An annotation as used by the dai-book-viewer.
    """

    def __init__(self, id, lemma):
        self.id = id
        self.score = None
        self.terms = []
        self.pages = []
        self.count = 0
        self.lemma = lemma
        self.references = []

    def add_occurence(self, term, page):
        if page not in self.pages:
            self.pages.append(page)
        if term not in self.terms:
            self.terms.append(term)
        self.count += 1

    def to_dict(self):
        return {
            "id": self.id,
            "score": self.score,
            "terms": self.terms,
            "pages": self.pages,
            "count": self.count,
            "lemma": self.lemma,
            "references": self.references
        }


def convert_timeml_to_annotation_json(source_file, output_file):

    with open(source_file, "r", encoding="utf-8") as file:
        xml = file.read()

    tag_generator = XMLTagPageGenerator(xml_str=xml)

    annotations = {}
    for tag, pages in tag_generator.iterate_tags_with_pages():
        if tag.name == "timex3":
            # use the xml attribute value (iso-formatted normalized time expression) as the lemma
            # becaue it comes closest to a real lemma for time expressions
            lemma = tag.attrs.get("value", "")
            # since each annotation has a unique lemma, use it for the id. Hex-encode to make sure
            # it doesn't contain any non-simple chars, whitespace etc.
            id = "timex" + lemma.encode().hex()
            annotation = annotations.get(lemma, Annotation(id, lemma))
            for page in pages:
                annotation.add_occurence(tag.text, page)
            annotations[lemma] = annotation

    output_obj = {
        "time_expressions": {
            "items": [a.to_dict() for a in annotations.values()]
        }
    }
    with open(output_file, "w", encoding="utf-8") as file:
        json.dump(output_obj, file, indent=4)


