#!/usr/bin/env bash

if test -f "/run/secrets/atom_api_key"; then
    echo "Found secret: setting ATOM_API_KEY"
    export ATOM_API_KEY=$(cat "/run/secrets/atom_api_key")
fi

if [ "$CILANTRO_ENV" = "development" ]
then
    watchmedo auto-restart -R -d service -d config -p="*.py;*.yml" -- flask run --host=0.0.0.0
else
    gunicorn -w 4 -k gevent -b :5000 service.run_service:app
fi
