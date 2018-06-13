from utils.celery_client import celery_app

celery_app.autodiscover_tasks([
    'nlp_worker.annotate'
], force=True)
