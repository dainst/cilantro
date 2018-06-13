from nlp_components.idai_journals.publications import TextAnalyzer
# dependency in docker container


def annotate(text, params):
    text_analyzer = TextAnalyzer(text)
    if 'lang' in params:
        text_analyzer.lang = params['lang']

    annotation = _run_annotation(text_analyzer, params)
    result = _add_metadata(text_analyzer, annotation)

    return {'result': result, 'status': 'Processing completed.'}


def _run_annotation(text_analyzer, params):

    result = dict()

    if 'NER' in params['operation']:
        result['named_entities'] = text_analyzer.do_ner()
    if 'POS' in params['operation']:
        result['part_of_speech_tags'] = text_analyzer.do_pos_tag()

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
