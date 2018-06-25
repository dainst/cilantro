import unittest
from unittest.mock import patch

from test.worker.nlp.text_analyzer_mock import TextAnalyzer
from workers.nlp.annotate.annotate import annotate, NoTextProvidedException, \
    InvalidNlpOperationException


@patch('workers.nlp.annotate.annotate._init_text_analyzer')
class AnnotateTest(unittest.TestCase):

    def test_valid_text_and_params(self, mock_init):
        mock_init.return_value = TextAnalyzer("success")
        text = "Perikles war ein Grieche. Genauso wie Aristoteles aus Stageira."
        params = {
            "operations": ["NER"]
        }
        result = annotate(text, params)
        self.assertTrue(result['named_entities'])

    def test_no_text(self, mock_init):
        mock_init.return_value = TextAnalyzer()
        text = ""
        params = {
            "operations": ["NER"]
        }
        self.assertRaises(NoTextProvidedException, annotate, text, params)

    def test_valid_operations(self, mock_init):
        try:
            mock_init.return_value = TextAnalyzer()
            text = "Foo"
            params = {
                "operations": ["POS"]
            }
            annotate(text, params)
            params = {
                "operations": ["NER"]
            }
            annotate(text, params)
            params = {
                "operations": ["POS", "NER", "Bar"]
            }
            annotate(text, params)
        except InvalidNlpOperationException as e:
            self.fail(f"Test unexpectedly raised InvalidNlpOperationException: "
                      f"{e}")

    def test_invalid_operations(self, mock_init):
        mock_init.return_value = TextAnalyzer()
        text = "Foo"
        params = {}
        self.assertRaises(InvalidNlpOperationException, annotate, text, params)
        params = {
            "operations": ["Foo"]
        }
        self.assertRaises(InvalidNlpOperationException, annotate, text, params)
        params = {
            "operations": ["Bar", "Foo"]
        }
        self.assertRaises(InvalidNlpOperationException, annotate, text, params)
