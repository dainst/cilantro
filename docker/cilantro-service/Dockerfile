FROM python:3.9-alpine AS base

ENV LIBRARY_PATH=/lib:/usr/lib
ENV PIPENV_VENV_IN_PROJECT=true
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

RUN apk add --update python3-dev py-pip gcc libffi libffi-dev musl-dev build-base

RUN pip3 install 'pipenv==2021.5.29'

COPY docker/cilantro-service/Pipfile Pipfile

FROM base

COPY docker/cilantro-service/Pipfile.lock Pipfile.lock
COPY docker/cilantro-service/Pipfile Pipfile
RUN set -ex && pipenv install --deploy --system

COPY ./utils /app/utils
COPY ./service /app/service
COPY ./resources /app/resources
COPY ./workers/task_information.py /app/workers/task_information.py

WORKDIR /app

COPY docker/cilantro-service/entrypoint.sh /entrypoint.sh


EXPOSE 5000

ENV FLASK_APP service/run_service.py

COPY docker/cilantro-service/VERSION .

ENTRYPOINT sh /entrypoint.sh
