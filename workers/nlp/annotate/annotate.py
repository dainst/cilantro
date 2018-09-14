import uuid


def annotate(text, lang=None):
    """
    Annotate the given text.

    Uses the TextAnalyzer of the dainst/nlp_components in the
    nlp-worker docker container to annotate the text.

    :param str text: the given text to annotate
    :param str lang: language of the text, if empty the text_analyzer
        tries to figure out it itself
    :return dict: generated annotations with metadata
    """
    if not text:
        return {}
    text_analyzer = _init_text_analyzer(text)
    if lang:
        text_analyzer.lang = lang

    return _add_metadata(text_analyzer, _full_ner(text_analyzer))


def _init_text_analyzer(text):
    """
    Initialize the Text Analyzer of the nlp components.

    :param str text: The text to analyze
    :return class: The text_analyzer
    """
    from nlp_components.idai_journals.publications import TextAnalyzer
    # dependency in docker container
    text_analyzer = TextAnalyzer(text)
    return text_analyzer


def _full_ner(text_analyzer):
    """
    Run complete NER.

    This includes extraction of different entity types and geotagging.

    :param class text_analyzer: the text_analyzer of nlp_components
    :return dict: json with persons, geotagged locations and metadata,
        readalbe by the viewer
    """
    named_entites = text_analyzer.do_ner()

    persons = _convert_list_of_objs_to_list_of_dicts(
        text_analyzer.get_persons(named_entites))
    locations = text_analyzer.get_locations(named_entites)
    geotagged_locations = _convert_list_of_objs_to_list_of_dicts(
        text_analyzer.geoparse(locations))

    return _generatere_viewer_json(persons, geotagged_locations)


def _generatere_viewer_json(persons, geotagged_locations):
    """
    Generate the complete, viewer compatible, JSON.

    :param list persons: all entities of type person
    :param list geotagged_locations: all entities of type location, enriched
        with coordinates and gazetteer ids
    :return dict: finalized json in viewer's format
    """
    persons = _create_json_for_entity_type(persons)
    locations = _create_json_for_entity_type(geotagged_locations)

    viewer_json = {"persons": {"items": persons},
                   "locations": {"items": locations}}
    return viewer_json


def _create_json_for_entity_type(entities):
    """
    Create JSON for every entity type.

    This is compatible to the viewer and the same for every entity type
        (person, location). Not used keys are filled with None
        (null in JSON).
    :param list entities: all entities of an entity type
    :return dict: viewer_compatible json of this entity type
    """
    viewer_entities = []
    for entity in entities:
        try:
            coordinates = [entity["latitude"], entity["longitude"]]
        except KeyError:
            coordinates = None

        references = []
        for key, value in entity["refids"].items():
            try:
                url = f"{entity['_baseurls'][key]}{value}"
                reference = {
                    "id": value,
                    "url": url,
                    "type": key
                }
            except KeyError:
                reference = {}
            references.append(reference)

        viewer_entity = {
            "id": str(uuid.uuid1()),
            "score": None,
            "terms": [entity["string"]],
            "pages": [1],  # as long as only one page is processed
            "count": 1,  # as long as every match is its own entry
            "lemma": entity["normform"],
            "coordinates": coordinates,
            "references": references
        }
        viewer_entities.append(viewer_entity)
    return viewer_entities


def _add_metadata(text_analyzer, annotations):
    """
    Add metadata to the annotations.

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
        "metadata": metadata
    }


def _convert_list_of_objs_to_list_of_dicts(list_of_objects):
    """
    Recursively convert a list of objects to a list of dicts.

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
            list_of_subobjects.append(
                _convert_list_of_objs_to_list_of_dicts(sub))
        return list_of_subobjects
    else:
        return list_of_objects.__dict__
