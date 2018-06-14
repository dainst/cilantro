from utils.celery_client import celery_app

celery_app.autodiscover_tasks([
    'workers.default.convert',
    'workers.default.pdf',
    'workers.default.repository',
    'workers.default.utils',
    'workers.default.xml'
], force=True)

print("ENTRYPOINT")
