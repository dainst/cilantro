
class MockDAIEntity:

    def __init__(self, text: str, start: int, end: int, page=0, refids=None, context=''):
        self.string = text
        self.span_start = start
        self.span_end = end
        self.page = page
        self.refids = refids if refids is not None else {}
        self.context = context
        self.normform = text.title()


class TextAnalyzer:
    """
    Text Analyzer for testing purposes. Mocks the TextAnalyzer of the
    nlp_components. Covers different test cases.
    """
    def __init__(self, testcase="default"):
        if testcase is "default":
            self.lang = "de"
            self.words = []
            self.sentences = []
            self.annotations = []
        elif testcase is "success":
            self.lang = "de"
            self.words = ["Perikles", "war", "ein", "Grieche", ".", "Genauso",
                          "wie", "Aristoteles", "aus", "Paris"]
            self.sentences = ["Perikles war ein Grieche.",
                              "Genauso wie Aristoteles aus Paris."]
            self.annotations = [('Perikles', 'I-PER'), ('war', 'O'), ('ein', 'O'),
                                ('Grieche', 'O'), ('.', 'O'), ('Genauso', 'O'),
                                ('wie', 'O'), ('Aristoteles', 'I-PER'),
                                ('aus', 'O'), ('Paris', 'I-LOC'), ('.', 'O')]
        else:
            raise Exception(f"Invalid testcase {testcase}")

    def do_ner(self):
        return self.annotations

    def do_pos_tag(self):
        return self.annotations

    @staticmethod
    def get_persons(ne):
        return [
            MockDAIEntity(text="Perikles", start=0, end=8),
            MockDAIEntity(text="Aristoteles", start=38, end=49)
        ]

    @staticmethod
    def get_locations(ne):
        return [
            MockDAIEntity(text="Paris", start=54, end=59)
        ]

    @staticmethod
    def geoparse(locs):
        paris = MockDAIEntity(text="Paris", start=54, end=59)
        paris.refids = {'idai': '2081915'}
        return [paris]
