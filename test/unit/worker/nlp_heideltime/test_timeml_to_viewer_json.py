

import unittest

from workers.nlp_heideltime.time_annotate.timeml_to_viewer_json import XMLTagPageGenerator


class XmlTagPageGeneratorTest(unittest.TestCase):

    input = """
    <xml>
        A tag on the <tag>first page</tag>
        \f
        Some text with a tag spanning the <another-tag>2nd and
        \f
        3rd page</another-tag>
    </xml>
    """

    def test_page_and_tag_generation(self):
        generator = XMLTagPageGenerator(self.input)

        results = list(generator.iterate_tags_with_pages())

        self.assertEqual(len(results), 3, "Should have the right number of results.")

        tag, pages = results[0]
        self.assertEqual(tag.name, "xml", "First tag has the right name.")
        self.assertEqual(pages, [1, 2, 3], "First tag spans all pages.")

        tag, pages = results[1]
        self.assertEqual(tag.name, "tag", "2nd tag has the right name.")
        self.assertEqual(pages, [1], "2nd tag is only on page one.")

        tag, pages = results[2]
        self.assertEqual(tag.name, "another-tag", "3rd tag has the right name.")
        self.assertEqual(pages, [2, 3], "3rd tag spans two pages.")

    def test_empty_input(self):
        generator = XMLTagPageGenerator("")
        results = list(generator.iterate_tags_with_pages())
        self.assertEqual(results, [], "Should produce an empty list on empty input.")
