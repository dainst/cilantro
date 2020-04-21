#!/usr/bin/env bash

if [ "$CILANTRO_ENV" = "development" ]
then
    watchmedo auto-restart -R -d service -d config -d workers -d utils -p="*.py;*.yml" -- celery -A workers.nlp_heideltime.tasks -Q nlp_heideltime,celery worker --loglevel=info
else
    celery -A workers.nlp_heideltime.tasks -Q nlp_heideltime,celery worker --loglevel=info
fi
