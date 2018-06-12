FROM python:alpine

ENV LIBRARY_PATH=/lib:/usr/lib
ENV PIPENV_VENV_IN_PROJECT=true
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

RUN set -ex && mkdir /app
# workaround for pipenv bug: https://github.com/pypa/pipenv/issues/1328
WORKDIR /app

COPY docker/service/Pipfile Pipfile
COPY docker/service/Pipfile.lock Pipfile.lock

RUN pip3 install pipenv
RUN set -ex && pipenv install --deploy --system

EXPOSE 5000

ENV FLASK_APP run_service.py

ENTRYPOINT watchmedo auto-restart -R -d service -d config -p="*.py;*.yml" -- flask run --host=0.0.0.0
