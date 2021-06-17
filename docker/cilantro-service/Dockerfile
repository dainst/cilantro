FROM python:3.6-buster

ENV LIBRARY_PATH=/lib:/usr/lib
ENV PIPENV_VENV_IN_PROJECT=true
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

RUN apt-get update && \
    apt-get -y install \
    python3-dev \
    gcc \
    libffi-dev \
    musl-dev

# Install dependencies letting poetry use the system python
RUN pip3 install 'poetry==1.0.9'
WORKDIR /app/
COPY docker/cilantro-service/pyproject.toml docker/cilantro-service/poetry.lock ./
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction

# Copy the rest of the app
COPY ./utils ./service ./resources ./
COPY ./workers/task_information.py /app/workers/

EXPOSE 5000
ENV FLASK_APP service/run_service.py

COPY docker/cilantro-service/entrypoint.sh /entrypoint.sh
COPY docker/cilantro-service/VERSION .

ENTRYPOINT sh /entrypoint.sh
