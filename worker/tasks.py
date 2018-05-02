from utils.celery_client import celery


celery.autodiscover_tasks([
    'worker.convert',
    'worker.repository',
    'worker.utils'
], force=True)
