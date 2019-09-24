#!/usr/bin/env bash

name=${1}
nocache=${2}
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

# bump version in VERSION file
awk -F'.' '{print $1"."$2"."$3+1}' docker/cilantro-${name}/VERSION > docker/cilantro-${name}/VERSION.tmp
mv docker/cilantro-${name}/VERSION.tmp docker/cilantro-${name}/VERSION
version=`cat docker/cilantro-${name}/VERSION`

docker-compose build ${name} ${nocache}

docker tag dainst/cilantro-${name}:latest dainst/cilantro-${name}:${version}

docker push dainst/cilantro-${name}:latest
docker push dainst/cilantro-${name}:${version}
