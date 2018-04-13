from utils.celery_client import celery


celery.autodiscover_tasks([
    'worker.repository',
    'worker.utils'
])
