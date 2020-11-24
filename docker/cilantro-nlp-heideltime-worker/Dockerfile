
# This extends the heideltime container from the chronoi-project, which is
# currently (01/2020) maintained in the pilot corpus project:
# https://github.com/dainst/chronoi-pilot-corpus-processing/tree/master/heideltime
FROM dainst/chronoi-heideltime:1.1.0

ENV LIBRARY_PATH=/lib:/usr/lib
ENV PIPENV_VENV_IN_PROJECT=true
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

# workaround for pipenv bug: https://github.com/pypa/pipenv/issues/1328
RUN set -ex && mkdir /app

WORKDIR /
RUN pip3 install 'pipenv==2018.11.26'
COPY docker/cilantro-nlp-heideltime-worker/Pipfile.lock Pipfile.lock
COPY docker/cilantro-nlp-heideltime-worker/Pipfile Pipfile
RUN set -ex && pipenv install --deploy --system

COPY ./utils /app/utils
COPY ./workers /app/workers
COPY ./resources /app/resources
WORKDIR /app

COPY docker/cilantro-nlp-heideltime-worker/entrypoint.sh /entrypoint.sh
COPY docker/cilantro-nlp-heideltime-worker/VERSION .

ENTRYPOINT bash /entrypoint.sh
