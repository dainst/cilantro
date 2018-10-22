#!/usr/bin/env bash

TEST="default" docker-compose up --exit-code-from frontend-test frontend-test
echo "Exiting with code $?"
