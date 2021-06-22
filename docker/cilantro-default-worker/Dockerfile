FROM python:3.6-buster

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

# Install dependencies letting poetry use the system python
RUN pip3 install 'poetry==1.0.9'
WORKDIR /poetry
COPY docker/cilantro-default-worker/pyproject.toml docker/cilantro-default-worker/poetry.lock ./
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction

# Copy the rest of the app
WORKDIR /app
COPY service ./service
COPY utils ./utils
COPY workers ./workers
COPY resources ./resources
COPY docker/cilantro-default-worker/entrypoint.sh /entrypoint.sh
COPY docker/cilantro-default-worker/VERSION .

ENTRYPOINT bash /entrypoint.sh






