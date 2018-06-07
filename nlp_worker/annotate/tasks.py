from utils.celery_client import celery_app
from worker.tasks import BaseTask
from nlp_components.idai_journals.publications import TextAnalyzer


@celery_app.task(bind=True, name="annotate", base=BaseTask)
def task_annotate(self, object_id, job_id):
    # read from json
    input_text = 0
    params = 0
    # print('STARTED')
    # text_analyzer = TextAnalyzer(input_text)
    # if 'lang' in params:
    #     text_analyzer.lang = params['lang']
    # self.update_state(state='PROGRESS',
    #                   meta={'status': 'Running NLP analysis...'})
    # annotation = _run_annotation(text_analyzer, params)
    # result = _add_metadata(annotation, text_analyzer)
    #
    # return {'result': result, 'status': 'Processing completed.'}
    print("Hello!!!!!!!!!!")


@celery_app.task(bind=True, name="get_enteties", base=BaseTask)
def task_get_entities(self, input_text, params):
    text_analyzer = TextAnalyzer(input_text)
    if 'lang' in params:
        text_analyzer.lang = params['lang']
    self.update_state(state='PROGRESS',
                      meta={'status': 'Running NLP analysis...'})

    if params['entity_type'] is not None:
        exclusive_entity_type = \
            [text_analyzer.SUPPORTED_ENTITY_TYPES[params["entity_type"]]]
    else:
        exclusive_entity_type = []

    entity_list = \
        text_analyzer.get_entities(
            text_analyzer.do_ner(),
            exclusive_entity_type,
            params['include_references'])

    result = {'entity_list': [entity.to_json() for entity in entity_list]}
    result = _add_metadata(result, text_analyzer)

    return {'result': result, 'status': 'Processing completed.'}


def _run_annotation(text_analyzer, params):

    result = dict()

    if 'NER' in params['operation']:
        result['named_entities'] = text_analyzer.do_ner()
    if 'POS' in params['operation']:
        result['part_of_speech_tags'] = text_analyzer.do_pos_tag()

    return result


def _add_metadata(result, text_analyzer):
    return {
        **result,
        **dict({
            "detected_language": text_analyzer.lang,
            "word_count": len(text_analyzer.words),
            "sentence_count": len(text_analyzer.sentences)
        })
    }


