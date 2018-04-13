from utils.celery_client import celery


celery.autodiscover_tasks([
    'worker.convert',
    'worker.match',
    'worker.publish',
    'worker.retrieve'
])
