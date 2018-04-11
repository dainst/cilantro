FROM python:alpine

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

USER nobody

ENTRYPOINT watchmedo auto-restart --recursive --patterns="*.py" -- celery -A tasks worker --loglevel=info
