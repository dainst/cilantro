from utils.celery_client import celery_app

celery_app.autodiscover_tasks([
    'workers.convert.image_pdf',
], force=True)

