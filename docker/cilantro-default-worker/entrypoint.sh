#!/usr/bin/env bash
if [ "$CILANTRO_ENV" = "development" ]
then
    watchmedo auto-restart -R -d service -d config -d workers -p="*.py;*.yml" -- celery -A workers.default.tasks -Q default,celery worker --loglevel=info
else
    celery -A workers.default.tasks -Q default,celery worker --loglevel=info
fi
