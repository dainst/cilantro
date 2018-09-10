#!/usr/bin/env bash
if [ "$CILANTRO_ENV" = "development" ]
then
    watchmedo auto-restart -R -d service -d config -p="*.py;*.yml" -- flask run --host=0.0.0.0
else
    flask run --host=0.0.0.0
fi
