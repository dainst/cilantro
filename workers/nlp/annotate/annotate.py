from nlp_components.idai_journals.publications import TextAnalyzer
# dependency in docker container


def annotate(text, params):
    """
    Uses the TextAnalyzer of the dainst/nlp_components in the nlp-worker
    docker container to annotate the text
    :param string text: the given text to annotate
    :param dict params: some configuration options, given as dict
    :return dict: generated annotations

    """
    text_analyzer = TextAnalyzer(text)
    if 'lang' in params:
        text_analyzer.lang = params['lang']

    annotation = _run_annotation(text_analyzer, params)
    result = _add_metadata(text_analyzer, annotation)

    return result


def _run_annotation(text_analyzer, params):
    result = {}

    if 'POS' in params['operation']:
        result['part_of_speech_tags'] = text_analyzer.do_pos_tag()
    if 'NER' in params['operation']:
        result['named_entities'] = text_analyzer.do_ner()

    return result


def _add_metadata(text_analyzer, result):
    return {
        **result,
        **dict({
            "detected_language": text_analyzer.lang,
            "word_count": len(text_analyzer.words),
            "sentence_count": len(text_analyzer.sentences)
        })
    }
