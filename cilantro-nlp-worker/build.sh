#!/usr/bin/env bash

echo "Enter your access token for dainst organization at github"
read token
docker image build -t cilantro-nlp-worker . --build-arg GITHUB_ACCESS_TOKEN=$token
docker push dainst/cilantro-nlp-worker
