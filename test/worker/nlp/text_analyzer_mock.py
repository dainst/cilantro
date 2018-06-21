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
                          "wie", "Aristoteles", "aus", "Stageria"]
            self.sentences = ["Perikles war ein Grieche.",
                              "Genauso wie Aristoteles aus Stageira."]
            self.annotations = [('Perikles', 'I-PER'), ('war', 'O'), ('ein', 'O'),
                                ('Grieche', 'O'), ('.', 'O'), ('Genauso', 'O'),
                                ('wie', 'O'), ('Aristoteles', 'I-PER'),
                                ('aus', 'O'), ('Stageira', 'O'), ('.', 'O')]
        else:
            raise Exception(f"Invalid testcase {testcase}")

    def do_ner(self):
        return self.annotations

    def do_pos_tag(self):
        return self.annotations
