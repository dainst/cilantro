#!/usr/bin/env bash

if test -f "/run/secrets/ojs_auth_key"; then
    echo "Found secret: setting OJS_AUTH_KEY"
    export OJS_AUTH_KEY=$(cat "/run/secrets/ojs_auth_key")
fi
if test -f "/run/secrets/omp_auth_key"; then
    echo "Found secret: setting OMP_AUTH_KEY"
    export OMP_AUTH_KEY=$(cat "/run/secrets/omp_auth_key")
fi
if test -f "/run/secrets/atom_api_key"; then
    echo "Found secret: setting ATOM_API_KEY"
    export ATOM_API_KEY=$(cat "/run/secrets/atom_api_key")
fi

if [ "$CILANTRO_ENV" = "development" ]
then
    watchmedo auto-restart -R -d service -d config -d workers -d utils -p="*.py;*.yml" -- celery -A workers.default.tasks -Q default,celery worker --loglevel=info
else
    celery -A workers.default.tasks -Q default,celery worker --loglevel=info
fi
