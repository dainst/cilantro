#!/usr/bin/env bash
if [ "$CILANTRO_ENV" = "development" ]
then
    watchmedo auto-restart -R -d service -d config -p="*.py;*.yml" -- flask run --host=0.0.0.0
else
    gunicorn -w 4 -b :5000 service.run_service:app
fi
