from utils.celery_client import celery


celery.autodiscover_tasks([
    'worker.pdf',
    'worker.convert',
    'worker.repository',
    'worker.utils'
], force=True)
