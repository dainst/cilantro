FROM python:alpine

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

USER nobody

ENTRYPOINT [ "celery", "-A", "tasks", "worker", "--loglevel", "info" ]
