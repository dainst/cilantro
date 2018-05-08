from utils.setup_logging import setup_logging
from utils.celery_client import celery


setup_logging()

celery.autodiscover_tasks([
    'worker.convert',
    'worker.repository',
    'worker.utils'
], force=True)
