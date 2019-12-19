from utils.celery_client import celery_app

celery_app.autodiscover_tasks([
    'workers.nlp_heideltime.time_annotate'
], force=True)
