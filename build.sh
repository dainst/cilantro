#!/usr/bin/env bash

name=${1}
tag=${2-latest}
nocache=${3}
token=$(grep GITHUB_ACCESS_TOKEN .env | xargs)
token=${token#*=}

if [ -z "${name}" ]
    then
        echo "Please specify a name"
        read name
fi

if [ -z "${nocache}" ]
    then
        nocache=""
fi

cd docker/${name}
rm Pipfile.lock
pipenv lock
cd ../..

docker image build -t ${name}:${tag} -f docker/${name}/Dockerfile . --build-arg GITHUB_ACCESS_TOKEN=${token} ${nocache}
docker tag ${name}:${tag} dainst/${name}:${tag}
docker push dainst/${name}:${tag}
exit