#!/usr/bin/env bash
if [ "$CILANTRO_ENV" = "development" ]
then
    watchmedo auto-restart -R -d service -d config -d workers -p="*.py;*.yml" -- celery -A workers.convert.tasks -Q convert worker --loglevel=info
else
    celery -A workers.convert.tasks -Q convert worker --loglevel=info --max-tasks-per-child=5
fi
