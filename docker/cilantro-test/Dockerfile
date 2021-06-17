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
    python3-sphinx  \
    python-watchdog \
    ocrmypdf


ENV LIBRARY_PATH=/lib:/usr/lib
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

RUN sed -i '/disable ghostscript format types/,+6d' /etc/ImageMagick-6/policy.xml

RUN pip3 install 'pipenv==2021.5.29'
COPY docker/cilantro-test/Pipfile Pipfile

FROM base

COPY docker/cilantro-test/Pipfile.lock Pipfile.lock
RUN set -ex && pipenv install --deploy --system
#RUN set -ex && pipenv install

COPY ./service /app/service
COPY ./test /app/test
COPY ./utils /app/utils
COPY ./workers /app/workers
COPY ./doc /app/doc
WORKDIR /app


COPY docker/cilantro-test/VERSION .
