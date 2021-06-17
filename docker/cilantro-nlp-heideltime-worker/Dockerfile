
# This extends the heideltime container from the chronoi-project, which is
# currently (01/2020) maintained in the pilot corpus project:
# https://github.com/dainst/chronoi-pilot-corpus-processing/tree/master/heideltime
FROM dainst/chronoi-heideltime:1.1.0

ENV LIBRARY_PATH=/lib:/usr/lib
ENV PIPENV_VENV_IN_PROJECT=true
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

RUN pip3 install 'poetry==1.0.9'
WORKDIR /app/
COPY docker/cilantro-nlp-heideltime-worker/pyproject.toml docker/cilantro-nlp-heideltime-worker/poetry.lock ./
# let poetry use the system python
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction

COPY ./utils ./workers ./resources ./
COPY docker/cilantro-nlp-heideltime-worker/entrypoint.sh /entrypoint.sh
COPY docker/cilantro-nlp-heideltime-worker/VERSION .

ENTRYPOINT bash /entrypoint.sh





