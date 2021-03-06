#!/usr/bin/env bash

function publishImage {
    # bump version in VERSION file
    awk -F'.' '{print $1"."$2"."$3+1}' docker/${1}/VERSION > docker/${1}/VERSION.tmp
    version=`cat docker/${1}/VERSION.tmp`
    echo "Bumping version of $1 to $version"

    if [[ $1 = "cilantro-frontend" ]]
    then
        echo "Also updating version in frontend's package.json."
        sed -i 's|"version": ".*"|"version": "'"$version"'"|' frontend/package.json
    fi

    # Build & publish image on dockerhub
    docker-compose -f docker-compose.build.yml build ${1#"cilantro-"} ${nocache}
    docker tag dainst/${1}:latest dainst/${1}:${version}
    docker push dainst/${1}:latest
    docker push dainst/${1}:${version}

    mv docker/${1}/VERSION.tmp docker/${1}/VERSION
}

nocache=${2}
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
