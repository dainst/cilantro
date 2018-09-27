FROM python:3.6-stretch

# needed for Pillow / PIL
RUN apt-get update && \
    apt-get -y install \
    build-essential \
    libpoppler-cpp-dev \
    pkg-config \
    python-dev \
    libmagickwand-dev \
    ghostscript

ENV LIBRARY_PATH=/lib:/usr/lib
ENV PIPENV_VENV_IN_PROJECT=true
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

# workaround for pipenv bug: https://github.com/pypa/pipenv/issues/1328
RUN set -ex && mkdir /app

COPY ./service /app/service
COPY ./utils /app/utils
COPY ./workers /app/workers
WORKDIR /app

COPY docker/cilantro-default-worker/Pipfile Pipfile
COPY docker/cilantro-default-worker/entrypoint.sh /entrypoint.sh

RUN pip3 install pipenv
RUN set -ex && pipenv lock && pipenv install --deploy --system

USER nobody

ENTRYPOINT bash /entrypoint.sh
