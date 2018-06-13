#!/usr/bin/env bash

docker image build -t cilantro-default-worker .
docker tag cilantro-default-worker dainst/cilantro-default-worker
docker push dainst/cilantro-default-worker
