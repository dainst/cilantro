FROM python:3.6-stretch

# needed for Pillow / PIL
RUN apt-get update
RUN apt-get -y install \
    build-essential \
    libjpeg-dev \
    zlib1g-dev \
    libtiff-dev \
    libpoppler-cpp-dev \
    pkg-config \
    python3-dev \
    libmagickwand-dev \
    ghostscript \
    tesseract-ocr

ENV LIBRARY_PATH=/lib:/usr/lib
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

WORKDIR /app

COPY Pipfile Pipfile
COPY Pipfile.lock Pipfile.lock

RUN pip3 install pipenv
RUN set -ex && pipenv install --deploy --system
