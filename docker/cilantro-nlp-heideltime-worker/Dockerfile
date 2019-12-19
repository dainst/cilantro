# NOTE/TODO: The dainst/heideltime version should be fixed here to
# allow versioning for the worker container defined in this file.
FROM heideltime:latest

RUN apt-get update && apt-get -y install \
    python3-pip

ENV LIBRARY_PATH=/lib:/usr/lib
ENV PIPENV_VENV_IN_PROJECT=true
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

RUN pip3 install \
    watchdog \
    celery \
    pymongo \
    jinja2 \
    lxml \
    redis

COPY ./utils /app/utils
COPY ./workers /app/workers
COPY ./resources /app/resources
WORKDIR /app

COPY docker/cilantro-nlp-heideltime-worker/entrypoint.sh /entrypoint.sh
COPY docker/cilantro-nlp-heideltime-worker/VERSION .

ENTRYPOINT bash /entrypoint.sh
