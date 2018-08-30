class NoTextProvidedException(Exception):
    pass


class InvalidNlpOperationException(Exception):
    pass


def annotate(text, params):
    """
    Annotates the given text.

    Uses the TextAnalyzer of the dainst/nlp_components in the
    nlp-worker docker container to annotate the text.

    :param str text: the given text to annotate
    :param dict params: some configuration options
    :return dict: generated annotations with metadata
    """
    _validate_input(text, params)
    text_analyzer = _init_text_analyzer(text)
    if 'lang' in params:
        text_analyzer.lang = params['lang']

    annotation = _run_annotation(text_analyzer, params['operations'])
    result = _add_metadata(text_analyzer, annotation)
    return result


def _validate_input(text, params):
    """
    Validates the text and parameters given.

    This avoids long initialising of text_analyzer if invalid text or
    params are provided.

    :param str text: the text to validate
    :param dict params: the parameters to validate
    :raises NoTextProvided: if text is empty string
    :raises InvalidNlpOperations: if params['operations'] does not contain
        POS or NER
    """
    if text is "":
        raise NoTextProvidedException("The provided Text is an empty string")

    try:
        params['operations']
    except KeyError:
        raise InvalidNlpOperationException("No operations specified in params")

    valid_params = {"POS", "NER"}
    if not (set(params['operations']).intersection(valid_params)):
        raise InvalidNlpOperationException(f"No valid operation found in "
                                           f"{params['operations']}")


def _init_text_analyzer(text):
    """
    Initialises the Text Analyzer of the nlp components.

    :param str text: The text to Analyze
    :return class: The text_analyzer
    """
    from nlp_components.idai_journals.publications import TextAnalyzer
    # dependency in docker container
    text_analyzer = TextAnalyzer(text)
    return text_analyzer


def _run_annotation(ta, operations):
    """
    Calls a method of the text_analyzer depending on the operations.

    :param class ta: the text_analyzer of nlp_components
    :param list operations: the operations to be excecuted
    :return dict: pure annotations without metadata
    """
    result = {}

    if 'POS' in operations:
        result['part_of_speech_tags'] = ta.do_pos_tag()
    if 'NER' in operations:
        result['named_entities'] = _full_ner(ta)

    return result


def _full_ner(ta):
    """
    Runs complete NER

    This includes extraction of different entity types and geotagging.

    :param class ta: the text_analyzer of nlp_components
    :return dict: dict with complete NEs, extracted persons and geoparsed
        locations
    """
    named_entites = ta.do_ner()
    persons = _convert_obj_to_dict(ta.get_persons(named_entites))
    locations = ta.get_locations(named_entites)
    geoparsed = _convert_obj_to_dict(ta.geoparse(locations))

    return {
        "complete_named_entities": named_entites,
        "persons": persons,
        "locations": geoparsed
    }


def _add_metadata(ta, annotations):
    """
    Adds metadata to the annotations.

    :param class ta: the text_analyzer of nlp_components
    :param dict annotations: annotations made before
    :return dict: annotations with metadata
    """
    metadata = {
            "detected_language": ta.lang,
            "word_count": len(ta.words),
            "sentence_count": len(ta.sentences)
        }
    return {
        **annotations,
        **metadata
    }


def _convert_obj_to_dict(obj):
    """
    Converts a (list of) objects to a (list of) dicts

    This works recursively and is needed because the NLP Textanalyzer
    sometimes gives back non-json-serializable objects, which need to
    be converted to json.

    :param obj: Object or list of objects to be converted to
        (list of) dicts.
    :return dict: object as dict or a list of those
    """
    if isinstance(obj, list):
        mylist = []
        for subobj in obj:
            mylist.append(_convert_obj_to_dict(subobj))
        return mylist
    else:
        return obj.__dict__
