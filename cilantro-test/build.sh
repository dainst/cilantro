#!/usr/bin/env bash

docker image build -t cilantro-test .
docker tag cilantro-test dainst/cilantro-test
docker push dainst/cilantro-test
