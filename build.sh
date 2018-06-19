#!/usr/bin/env bash

name=${1}
tag=${2-latest}
token=$(grep github_access_token .env | xargs)
token=${token#*=}

if [ -z "${name}" ]
    then
        echo "Please specify a name"
        read name
fi

cd ${name}
docker image build -t ${name}:${tag} . --build-arg GITHUB_ACCESS_TOKEN=${token}
docker tag ${name}:${tag} dainst/${name}:${tag}
docker push dainst/${name}:${tag}
