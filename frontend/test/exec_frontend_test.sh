#!/usr/bin/env bash

TEST="default" docker-compose up --exit-code-from frontend-test frontend-test
res=$?
echo "Exiting with code $res"
exit ${res}