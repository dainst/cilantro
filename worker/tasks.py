from utils.celery_client import celery

celery.autodiscover_tasks(['foo', 'bar'])
