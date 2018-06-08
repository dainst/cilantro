import os

import celery.signals
from celery.task import Task

from utils.setup_logging import setup_logging
from utils.celery_client import celery_app


setup_logging()


@celery.signals.setup_logging.connect
def on_celery_setup_logging(**kwargs):
    pass


class BaseTask(Task):

    working_dir = os.environ['WORKING_DIR']

    def get_work_path(self, job_id):
        return os.path.join(self.working_dir, job_id)


celery_app.autodiscover_tasks([
    'worker.convert',
    'worker.pdf',
    'worker.repository',
    'worker.utils',
    'worker.xml'
], force=True)
