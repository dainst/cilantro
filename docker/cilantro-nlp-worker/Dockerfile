
# This extends the nlp-components image, which is maintained at:
#   https://github.com/dainst/nlp_components
FROM dainst/nlp-components:0.8.1

ENV LIBRARY_PATH=/lib:/usr/lib
ENV PIPENV_VENV_IN_PROJECT=true
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

USER root

# Install dependencies letting poetry use the system python
RUN pip3 install 'poetry==1.0.9'
WORKDIR /poetry
COPY docker/cilantro-nlp-worker/pyproject.toml docker/cilantro-nlp-worker/poetry.lock ./
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction

USER nlp

# Copy the rest of the app
WORKDIR /app
COPY utils ./utils
COPY workers ./workers
COPY resources ./resources
COPY docker/cilantro-nlp-worker/entrypoint.sh /entrypoint.sh
COPY docker/cilantro-nlp-worker/VERSION .

# Make imports "from nlp_components" possible
ENV PYTHONPATH="/usr/src/nlp_components"

ENTRYPOINT bash /entrypoint.sh
