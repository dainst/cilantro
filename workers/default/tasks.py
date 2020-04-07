from utils.celery_client import celery_app

celery_app.autodiscover_tasks([
    'workers.default.repository',
    'workers.default.utils',
    'workers.default.xml',
    'workers.default.ojs',
    'workers.default.omp',
    'workers.default.arachne',
    'workers.default.atom'
    ], force=True)
