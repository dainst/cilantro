import unittest
import json
from urllib.error import HTTPError

from workers.default.ojs.ojs_api import publish, generate_frontmatters


class GenerateFrontmatterTest(unittest.TestCase):
    """Test the usage of the OJS frontmatter plugin."""

    published_articles = []

    @classmethod
    def setUpClass(cls):
        """
        Prepare some test data for the frontmatter generation.

        As a cass method this runs once before all the tests are done.
        It uses the 'publish_to_ojs' worker which in turn uses
        OJS frontmatter plugin to generate 4 articles in OJS. It is done
        in 2 calls as the test import XML only contains 2 articles
        and the test is supposed to take a list with multiple articles.
        One article is a basic text though which is supposed to fail.
        Therefore the normal test uses the even number IDs and the test
        expecting failure the odd numbers refenrecing txt instead of PDF.
        """
        ojs_import_file = 'test/resources/objects/xml/ojs_import.xml'
        _, response_text = publish(ojs_import_file, 'test')
        cls.published_articles.extend(
            json.loads(response_text)['published_articles'])
        _, response_text = publish(ojs_import_file, 'test')
        cls.published_articles.extend(
            json.loads(response_text)['published_articles'])

    def test_generate_frontmatter(self):
        """
        Test valid PDF documents in OJS to generate frontmatter for.

        Takes the even numbered IDs from the published articles in the setup
        method, which are supposed to be valid PDF files.
        """
        response_status_code, response_text = \
            generate_frontmatters(self.published_articles[::2])

        self.assertEqual(200, response_status_code)
        self.assertIn('\"success\":true', response_text)

    def test_generate_frontmatter_txt(self):
        """
        Test invalid text documents in OJS to generate frontmatter for.

        Takes the odd numbered IDs from the published articles in the setup
        method, which are supposed to fail. The expected result of the call is
        to return a 500 HTTP error.
        """
        self.assertRaises(HTTPError, generate_frontmatters,
                          self.published_articles[1::2])
