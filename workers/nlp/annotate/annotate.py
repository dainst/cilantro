import uuid


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
    viewer_comp = _generatere_viewer_json(annotation)
    result = _add_metadata(text_analyzer, annotation)
    return viewer_comp


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


def _run_annotation(text_analyzer, operations):
    """
    Calls a method of the text_analyzer depending on the operations.

    :param class text_analyzer: the text_analyzer of nlp_components
    :param list operations: the operations to be excecuted
    :return dict: pure annotations without metadata
    """
    result = {}

    if 'POS' in operations:
        result['part_of_speech_tags'] = text_analyzer.do_pos_tag()
    if 'NER' in operations:
        result['named_entities'] = _full_ner(text_analyzer)

    return result


def _full_ner(text_analyzer):
    """
    Runs complete NER

    This includes extraction of different entity types and geotagging.

    :param class text_analyzer: the text_analyzer of nlp_components
    :return dict: dict with complete NEs, extracted persons and geoparsed
        locations
    """
    named_entites = text_analyzer.do_ner()
    persons = _convert_list_of_objs_to_list_of_dicts(
        text_analyzer.get_persons(named_entites))
    locations = text_analyzer.get_locations(named_entites)
    geoparsed = _convert_list_of_objs_to_list_of_dicts(
        text_analyzer.geoparse(locations))

    return {
        "complete_named_entities": named_entites,
        "persons": persons,
        "locations": geoparsed
    }


def _generatere_viewer_json(annotation):
    persons = annotation["named_entities"]["persons"]
    locations = annotation["named_entities"]["locations"]
    persons = _modify_entries(persons)
    locations = _modify_entries(locations)

    json = {"persons": {"items": persons}, "locations": {"items": locations}}
    return json


def _modify_entries(entrylist):
    resultlist = []
    for entrydict in entrylist:
        try:
            coordinates = [entrydict["latitude"], entrydict["longitude"]]
        except KeyError:
            coordinates = None

        references = []
        for key, value in entrydict["refids"].items():
            try:
                url = f"{entrydict['_baseurls'][key]}{value}"
                reference = {
                    "id": value,
                    "url": url,
                    "type": key
                }
            except KeyError:
                reference = {}
            references.append(reference)

        resultdict = {
            "id": str(uuid.uuid1()),
            "score": None,
            "terms": [entrydict["string"]],
            "pages": [1],  # as long as only one page is processed
            "count": 1,  # as long as every match is its own entry
            "lemma": entrydict["normform"],
            "coordinates": coordinates,
            "references": references
        }
        resultlist.append(resultdict)
    return resultlist


def _add_metadata(text_analyzer, annotations):
    """
    Adds metadata to the annotations.

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


def _convert_list_of_objs_to_list_of_dicts(list_of_objects):
    """
    Recursively converts a list of objects to a list of dicts

    This works recursively and is needed because the NLP Textanalyzer
    sometimes gives back a list of non-json-serializable objects, which
    need to be converted to dicts. The list structure has to be kept.

    :param list list_of_objects: List of objects to be converted to
        list of dicts.
    :return list: list of objects or a single one
    """
    if isinstance(list_of_objects, list):
        list_of_subobjects = []
        for sub in list_of_objects:
            list_of_subobjects.append(_convert_list_of_objs_to_list_of_dicts(sub))
        return list_of_subobjects
    else:
        return list_of_objects.__dict__
