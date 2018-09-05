#!/usr/bin/env bash
if [ "$CILANTRO_ENV" = "development" ]
then
    watchmedo auto-restart -R -d workers -p="*.py" -- celery -Q nlp -A workers.nlp.tasks worker --loglevel=info
else
    celery -Q nlp -A workers.nlp.tasks worker --loglevel=info
fi
