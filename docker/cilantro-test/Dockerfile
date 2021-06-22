FROM python:3.6-buster

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

# Install dependencies letting poetry use the system python
RUN pip3 install 'poetry==1.0.9'
WORKDIR /poetry
COPY docker/cilantro-test/pyproject.toml docker/cilantro-test/poetry.lock ./
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction

# Copy the rest of the app
WORKDIR /app
COPY service ./service
COPY test ./test
COPY utils ./utils
COPY workers ./workers
COPY doc ./doc
COPY docker/cilantro-test/VERSION .
