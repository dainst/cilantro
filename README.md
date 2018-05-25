# Cilantro

Cilantro is a task runner designed to manage long running distributed jobs that
operate on file system objects. It is written in Python (3.6+) and uses
[Celery](http://docs.celeryproject.org/) and [Flask](http://flask.pocoo.org/).

## Install
* Copy the `.env-default` file to `.env` and modify it, do the same thing with `test/integration/env-default.py`.

* Install docker (Community Edition)

    You might have to add the proper 3rd party PPA. Refer to the official documentation. Example for Ubuntu-based distributions: https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-ce

    `sudo apt install docker-ce`

* Install Pip and Pipenv

    `sudo apt-get install python3-pip`

    `pip install pipenv`

* Install the necessary python packages via pipenv. This uses the local Pipfile in the directory.

    `pipenv install`

## Running the app with docker

    docker-compose build
    docker-compose up

To stop the application run:

    `docker-compose stop`

### Testing the application manually

In order for the test to function properly you have to create some files with
.tif ending in the folder `./data/staging/foo`.

The web service runs on port 5000. The following command will create a test task:

    curl -XPOST http://localhost:5000/job/test/foo

You can then query the job status with the returned job_id:

    curl http://localhost:5000/job/<job_id>

### Monitoring

[Flower](https://flower.readthedocs.io/) is included in the docker config and
is available for debugging under http://localhost:5555.

## Running unit tests

* Start the application as described under [Running the app with docker
](https://github.com/dainst/cilantro#running-the-app-with-docker)

* Run the tests

    `python3 -m unittest`

* Alternatively you can run the complete build script out of the [build-scripts repository](https://github.com/dainst/build-scripts/).
After cloing the repo into your workspace, run the following command from within your cilantro directory.

    `../build-scripts/cilantro-build.sh`

This will build, start and stop the docker infrastructure and run the tests.

## Troubleshooting

On Linux hosts the tests will fail because the data directory created by
docker not have the right permissions and the user account that runs the test can not access it. The easiest way to fix that is just to change the owner on the whole directory and subfolders.

    `sudo chown -R $(whoami):$(whoami) data/`

After that re-run the tests and they may succeed.
