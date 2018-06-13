#!/usr/bin/env bash

docker image build -t cilantro-task-monitor .
docker tag cilantro-task-monitor dainst/cilantro-task-monitor
docker push dainst/cilantro-task-monitor
