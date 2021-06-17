FROM python:3.9-buster as base

# needed for Pillow / PIL
RUN apt-get update && \
    apt-get -y install \
    build-essential \
    libjpeg-dev \
    zlib1g-dev \
    libtiff-dev \
    libpoppler-cpp-dev \
    pkg-config \
    python3-dev \
    libvips-dev \
    ghostscript \
    tesseract-ocr-deu \
    libyaml-dev \
    python-setuptools \
    python-watchdog \
    ocrmypdf \
    pngquant

ENV LIBRARY_PATH=/lib:/usr/lib
ENV PIPENV_VENV_IN_PROJECT=true
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

RUN pip3 install 'pipenv==2021.5.29'
COPY docker/cilantro-convert-worker/Pipfile Pipfile

FROM base

COPY docker/cilantro-convert-worker/Pipfile.lock Pipfile.lock

RUN set -ex && pipenv install --deploy --system

RUN set -ex && mkdir /app
COPY ./service /app/service
COPY ./utils /app/utils
COPY ./workers /app/workers
WORKDIR /app

COPY docker/cilantro-convert-worker/entrypoint.sh /entrypoint.sh

COPY docker/cilantro-convert-worker/VERSION .

ENTRYPOINT bash /entrypoint.sh
