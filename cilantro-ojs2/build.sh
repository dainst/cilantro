#!/usr/bin/env bash

name=cilantro-ojs2
tag=stable

echo "Enter your access token for dainst organization at github"
read token
docker image build -t ${name}:${tag} . --build-arg GITHUB_ACCESS_TOKEN=$token
docker tag ${name}:${tag} dainst/${name}:${tag}
docker push dainst/${name}:${tag}
