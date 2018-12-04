#!/usr/bin/env bash

### Install required libraries ###
sudo apt-get install -y python3-dev libpoppler-cpp-dev
sudo apt-get install -y docker-compose
pip3 install --user -r doc/requirements.txt

### Preparation ###
cp config/users.yml-default config/users.yml

### Startup ###
docker-compose pull
docker-compose up -d > docker.log

### Backend Tests ###
test/exec_docker_test.sh
backend_test_return_code=$?

if [ $backend_test_return_code -ne 0 ]; then
  exit 1;
fi

### Frontend Tests ###
frontend/test/exec_frontend_test.sh

### Build documentation ###
doc/build-doc.sh
# cleanup
rm -r doc/_build/doctrees
find doc -maxdepth 1 -type f \
! -name 'api.rst' ! -name 'build-doc.sh' \! -name 'conf.py' \
! -name 'index.rst' ! -name 'Makefile' ! -name 'requirements.txt' \
-exec rm -f {} +

### Shutdown ###
docker-compose stop
docker-compose down
