
import copy


class MockDAIEntity:

    def __init__(self, text: str, start: int, end: int, page=0, references=None, context=''):
        self.string = text
        self.span_start = start
        self.span_end = end
        self.page = page
        self.references = references if references is not None else []
        self.context = context
        self.normform = text.title()


class TextAnalyzer:

    mocked_entities = [
        MockDAIEntity(text="Perikles", start=0, end=8),
        MockDAIEntity(text="Aristoteles", start=38, end=49),
        MockDAIEntity(text="Paris", start=54, end=59)
    ]

    """
    Text Analyzer for testing purposes. Mocks the TextAnalyzer of the
    nlp_components.
    """
    def __init__(self):
        self.lang = "de"
        self.words = ["Perikles", "war", "ein", "Grieche", ".", "Genauso",
                      "wie", "Aristoteles", "aus", "Paris"]
        self.sentences = ["Perikles war ein Grieche.",
                          "Genauso wie Aristoteles aus Paris."]
        self.annotations = [('Perikles', 'I-PER'), ('war', 'O'), ('ein', 'O'),
                            ('Grieche', 'O'), ('.', 'O'), ('Genauso', 'O'),
                            ('wie', 'O'), ('Aristoteles', 'I-PER'),
                            ('aus', 'O'), ('Paris', 'I-LOC'), ('.', 'O')]

    def do_ner(self):
        return self.annotations

    def do_pos_tag(self):
        return self.annotations

    @classmethod
    def get_persons(cls, _):
        return cls.mocked_entities[0:2]

    @classmethod
    def get_locations(cls, _):
        return cls.mocked_entities[2:3]

    @classmethod
    def geoparse(cls, locs):
        result = copy.deepcopy(locs)
        for location in result:
            location.references = ['https://gazetteer.dainst.org/place/2081915']
        return result

    @staticmethod
    def get_version() -> str:
        return "0.0.0-mock-analyzer"
