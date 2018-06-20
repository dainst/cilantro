from nlp_components.idai_journals.publications import TextAnalyzer
# dependency in docker container


class NoTextProvided(Exception):
    pass


class InvalidNlpOperations(Exception):
    pass


def annotate(text, params):
    """
    Uses the TextAnalyzer of the dainst/nlp_components in the
    nlp-worker docker container to annotate the text
    :param str text: the given text to annotate
    :param dict params: some configuration options
    :return dict: generated annotations with metadata
    """
    _validate_input(text, params)
    text_analyzer = TextAnalyzer(text)
    if 'lang' in params:
        text_analyzer.lang = params['lang']

    annotation = _run_annotation(text_analyzer, params['operations'])
    result = _add_metadata(text_analyzer, annotation)

    return result


def _run_annotation(text_analyzer, operations):
    """
    Calls a method of the text_analyzer depending on the operations
    :param class text_analyzer: the text_analyzer of nlp_components
    :param list operations: the operations to be excecuted
    :return dict: pure annotations without metadata
    """
    result = {}

    if 'POS' in operations:
        result['part_of_speech_tags'] = text_analyzer.do_pos_tag()
    if 'NER' in operations:
        result['named_entities'] = text_analyzer.do_ner()

    return result


def _add_metadata(text_analyzer, annotations):
    """
    Adds metadata to the annotations
    :param class text_analyzer: the text_analyzer of nlp_components
    :param dict annotations: annotations made before
    :return dict: annotations with metadata
    """
    metadata = {
            "detected_language": text_analyzer.lang,
            "word_count": len(text_analyzer.words),
            "sentence_count": len(text_analyzer.sentences)
        }
    return {
        **annotations,
        **metadata
    }


def _validate_input(text, params):
    """
    Validates the text and parameters given. This avoids long
    initialising of text_analyzer if invalid text or params are provided.
    :param str text: the text to validate
    :param dict params: the parameters to validate
    :raises NoTextProvided: if text is empty string
    :raises InvalidNlpoperations: if params['operations'] does not contain
        POS or NER
    """
    if text is "":
        raise NoTextProvided(f"The provided Text is an empty string")
    if ('NER' or 'POS') not in params['operations']:
        raise InvalidNlpOperations(f"Ivalid operations {params['operations']}")
