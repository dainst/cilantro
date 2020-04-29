from utils.celery_client import celery_app

celery_app.autodiscover_tasks([
    'workers.nlp_heideltime.time_annotate',
    'workers.nlp_heideltime.convert_timeml_to_viewer_json'
], force=True)
