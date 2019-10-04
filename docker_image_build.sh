#!/usr/bin/env bash

function publishImage {
    # bump version in VERSION file
    awk -F'.' '{print $1"."$2"."$3+1}' docker/${1}/VERSION > docker/${1}/VERSION.tmp
    version=`cat docker/${1}/VERSION.tmp`
    echo "Bumping version of $1 to $version"

    # Build & publish image on dockerhub
    docker-compose build ${1#"cilantro-"} ${nocache}
    docker tag dainst/${1}:latest dainst/${1}:${version}
    docker push dainst/${1}:latest
    docker push dainst/${1}:${version}

    mv docker/${1}/VERSION.tmp docker/${1}/VERSION
}

nocache=${2}
token=$(grep GITHUB_ACCESS_TOKEN .env | xargs)
token=${token#*=}

if [ -z "${nocache}" ] ; then
    nocache=""
fi

if [ -z "${1}" ] ; then
    for d in docker/*/ ; do
        publishImage $(basename ${d})
    done
else
    publishImage $1
fi
