FROM python:3.6-stretch

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
    libmagickwand-dev \
    ghostscript \
    tesseract-ocr \
    tesseract-ocr-deu \
    python3-sphinx


ENV LIBRARY_PATH=/lib:/usr/lib
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8


RUN pip3 install pipenv
COPY docker/cilantro-test/Pipfile.lock Pipfile.lock
COPY docker/cilantro-test/Pipfile Pipfile
RUN set -ex && pipenv install --deploy --system

COPY ./service /app/service
COPY ./test /app/test
COPY ./utils /app/utils
COPY ./workers /app/workers
COPY ./doc /app/doc
WORKDIR /app


COPY docker/cilantro-test/VERSION .
