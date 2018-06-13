#!/usr/bin/env bash

docker image build -t cilantro-task-monitor .
docker push dainst/cilantro-task-monitor
