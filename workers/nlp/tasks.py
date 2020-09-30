from utils.celery_client import celery_app

celery_app.autodiscover_tasks([
    'workers.nlp.annotate',
    'workers.nlp.format'
], force=True)
