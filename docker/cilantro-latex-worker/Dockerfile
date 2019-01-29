FROM python:3.6-stretch

MAINTAINER Deutsches Archäologisches Institut "dev@dainst.de"

ARG GITHUB_ACCESS_TOKEN
# needed for Pillow / PIL
RUN apt-get update && \
    apt-get -y install \
    build-essential \
    python-dev \
    texlive \
    texlive-lang-german \
    texlive-latex-extra \
    texlive-luatex


ENV LIBRARY_PATH=/lib:/usr/lib
ENV PIPENV_VENV_IN_PROJECT=true
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

# workaround for pipenv bug: https://github.com/pypa/pipenv/issues/1328
RUN set -ex && mkdir /app

RUN git clone https://x-access-token:${GITHUB_ACCESS_TOKEN}@github.com/dainst/ojs-dainst-ltx-frontmatter.git /frontmatter
WORKDIR /frontmatter
RUN git checkout cilantro-container
RUN chown -R 1000:1000 .

COPY ./service /app/service
COPY ./utils /app/utils
COPY ./workers /app/workers
COPY ./resources /app/resources
WORKDIR /app

COPY docker/cilantro-latex-worker/Pipfile Pipfile
COPY docker/cilantro-latex-worker/entrypoint.sh /entrypoint.sh

RUN pip3 install pipenv
RUN set -ex && pipenv lock && pipenv install --deploy --system

ENTRYPOINT bash /entrypoint.sh
