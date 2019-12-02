FROM python:3.6-alpine

ENV LIBRARY_PATH=/lib:/usr/lib
ENV PIPENV_VENV_IN_PROJECT=true
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

RUN apk add --update python-dev py-pip gcc libffi libffi-dev musl-dev

# workaround for pipenv bug: https://github.com/pypa/pipenv/issues/1328
RUN set -ex && mkdir /app

RUN pip3 install pipenv
COPY docker/cilantro-service/Pipfile.lock Pipfile.lock
COPY docker/cilantro-service/Pipfile Pipfile
RUN set -ex && pipenv install --deploy --system

COPY ./utils /app/utils
COPY ./service /app/service
WORKDIR /app

COPY docker/cilantro-service/entrypoint.sh /entrypoint.sh


EXPOSE 5000

ENV FLASK_APP service/run_service.py

COPY docker/cilantro-service/VERSION .

ENTRYPOINT sh /entrypoint.sh
