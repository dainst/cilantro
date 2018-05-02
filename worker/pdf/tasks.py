from worker.pdf.pdf_processor import cut_pdf
from utils.celery_client import celery

@celery.task(name="cutPDF")
def process_pdf(data):
    cut_pdf(data)
