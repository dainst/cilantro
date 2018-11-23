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
    tesseract-ocr-deu


ENV LIBRARY_PATH=/lib:/usr/lib
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

COPY ./service /app/service
COPY ./test /app/test
COPY ./utils /app/utils
COPY ./workers /app/workers
WORKDIR /app

COPY docker/cilantro-test/Pipfile Pipfile

RUN pip3 install pipenv
RUN set -ex && pipenv lock && pipenv install --deploy --system
