#!/usr/bin/env bash

docker image build -t cilantro-task-service .
docker push dainst/cilantro-task-service
