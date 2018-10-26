#!/bin/sh
set -e

cd doc

# Generate rst files from sources
sphinx-apidoc -o . ../

# Python modules are imported for reading the docstrings, therefore some
# environment variables are needed
BROKER_HOST=broker BROKER_USER=user BROKER_PASSWORD=password \
DB_HOST=db \
CONFIG_DIR=../config RESOURCE_DIR=test/resources WORKING_DIR=/data/workspace \
REPOSITORY_DIR=/data/repository STAGING_DIR=/data/staging \
OJS_SERVER=ojs OJS_PORT=80 OJS_AUTH_KEY=YWRtaW4=:cGFzc3dvcmQ= \
make html
