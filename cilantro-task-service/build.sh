#!/usr/bin/env bash

docker image build -t cilantro-task-service .
docker tag cilantro-task-service dainst/cilantro-task-service
docker push dainst/cilantro-task-service
