from utils.celery_client import celery_app

celery_app.autodiscover_tasks([
    'workers.default.repository',
    'workers.default.utils',
    'workers.default.xml',
    'workers.default.ojs',
    'workers.default.image'
    ], force=True)
