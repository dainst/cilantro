from utils.celery_client import celery_app

celery_app.autodiscover_tasks([
    'workers.latex.frontmatter'
    ], force=True)
