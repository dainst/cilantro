import unittest
from unittest.mock import patch

from test.unit.worker.nlp.text_analyzer_mock import TextAnalyzer
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

    def test_annotating_plain_text_returns_xmi_input(self, mock_init):
        # input = "Perikles war ein Grieche. Genauso wie Aristoteles aus Stageira."
        # result = analyzer.annotate_text(text)
        pass

    def test_annotating_previously_tagged_xmi(self, mock_init):
        # input = load_from_example_heideltime_file
        # result = analyzer.annotate_xmi_cas(text)
        pass
