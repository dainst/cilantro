#!/usr/bin/env bash

if test -f "/run/secrets/ojs_auth_key"; then
    echo "Found secret: setting OJS_AUTH_KEY"
    export OJS_AUTH_KEY=$(cat "/run/secrets/ojs_auth_key")
fi
if test -f "/run/secrets/atom_api_key"; then
    echo "Found secret: setting ATOM_API_KEY"
    export ATOM_API_KEY=$(cat "/run/secrets/atom_api_key")
fi

if [ "$CILANTRO_ENV" = "development" ]
then
    watchmedo auto-restart -R -d service -d config -d workers -p="*.py;*.yml" -- celery -A workers.default.tasks -Q default,celery worker --loglevel=info
else
    celery -A workers.default.tasks -Q default,celery worker --loglevel=info
fi
