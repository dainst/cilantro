import unittest
from unittest.mock import patch

from test.worker.nlp.text_analyzer_mock import TextAnalyzer
from workers.nlp.annotate.annotate import annotate


@patch('workers.nlp.annotate.annotate._init_text_analyzer')
class AnnotateTest(unittest.TestCase):

    def test_valid_text(self, mock_init):
        mock_init.return_value = TextAnalyzer("success")
        text = "Perikles war ein Grieche. Genauso wie Aristoteles aus Stageira."
        result = annotate(text)
        self.assertEqual(result['metadata']['sentence_count'], 2)

    def test_no_text(self, mock_init):
        mock_init.return_value = TextAnalyzer()
        text = ""
        result = annotate(text)
        self.assertEqual(result, {})
