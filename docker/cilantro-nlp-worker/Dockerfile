
# This extends the nlp-components image, which is maintained at:
#   https://github.com/dainst/nlp_components
FROM dainst/nlp-components:0.8.1 as base

ENV LIBRARY_PATH=/lib:/usr/lib
ENV PIPENV_VENV_IN_PROJECT=true
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

# workaround for pipenv bug: https://github.com/pypa/pipenv/issues/1328
USER root
RUN set -ex && mkdir /app && chown nlp:nlp /app

WORKDIR /
RUN pip3 install 'pipenv==2021.5.29'
COPY docker/cilantro-nlp-worker/Pipfile Pipfile

FROM base

COPY docker/cilantro-nlp-worker/Pipfile.lock Pipfile.lock
RUN set -ex && pipenv install --deploy --system

USER nlp
COPY ./utils /app/utils
COPY ./workers /app/workers
COPY ./resources /app/resources
WORKDIR /app

# Make imports "from nlp_components" possible
ENV PYTHONPATH="/usr/src/nlp_components"

COPY docker/cilantro-nlp-worker/entrypoint.sh /entrypoint.sh
COPY docker/cilantro-nlp-worker/VERSION .

ENTRYPOINT bash /entrypoint.sh
