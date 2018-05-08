import celery.signals
from utils.setup_logging import setup_logging
from utils.celery_client import celery_app


setup_logging()


@celery.signals.setup_logging.connect
def on_celery_setup_logging(**kwargs):
    pass


celery_app.autodiscover_tasks([
    'worker.convert',
    'worker.repository',
    'worker.utils'
], force=True)
