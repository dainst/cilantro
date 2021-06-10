FROM python:3.6-stretch

# needed for Pillow / PIL
RUN apt-get update && \
    apt-get -y install \
    build-essential \
    libpoppler-cpp-dev \
    pkg-config \
    python3-dev \
    libmagickwand-dev \
    ghostscript \
    libyaml-dev \
    python-setuptools \
    python-watchdog

ENV LIBRARY_PATH=/lib:/usr/lib
ENV PIPENV_VENV_IN_PROJECT=true
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

# workaround for pipenv bug: https://github.com/pypa/pipenv/issues/1328
RUN set -ex && mkdir /app


RUN pip3 install 'pipenv==2018.11.26'
COPY docker/cilantro-default-worker/Pipfile.lock Pipfile.lock
COPY docker/cilantro-default-worker/Pipfile Pipfile
RUN set -ex && pipenv install --deploy --system
#RUN set -ex && pipenv install
COPY ./service /app/service
COPY ./utils /app/utils
COPY ./workers /app/workers
COPY ./resources /app/resources
WORKDIR /app


COPY docker/cilantro-default-worker/entrypoint.sh /entrypoint.sh

COPY docker/cilantro-default-worker/VERSION .

ENTRYPOINT bash /entrypoint.sh
