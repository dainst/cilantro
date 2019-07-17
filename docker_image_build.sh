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
awk -F'.' '{print $1"."$2"."$3+1}' docker/${name}/VERSION > docker/${name}/VERSION.tmp
mv docker/${name}/VERSION.tmp docker/${name}/VERSION
version=`cat docker/${name}/VERSION`

if [[ $name  = "cilantro-frontend" ]]
then
    cd frontend
    npm install
    npm run build
    cd ..
fi

docker image build -t dainst/${name}:${version} -f docker/${name}/Dockerfile . --build-arg GITHUB_ACCESS_TOKEN=${token} ${nocache}

docker push dainst/${name}:latest
docker push dainst/${name}:${version}
