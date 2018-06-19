# Cilantro

Cilantro is a task runner designed to manage long running distributed jobs that
operate on file system objects. It is written in Python (3.6+) and uses
[Celery](http://docs.celeryproject.org/) and [Flask](http://flask.pocoo.org/).

## Install

* Copy the `.env-default` file to `.env` and modify it. In most cases only
  `UID` has to be adjusted. The UID / GID of the current user can be read with
  `id -u` / `id -g` on UNIX systems.

* Install docker (Community Edition)

    You might have to add the proper 3rd party PPA. Refer to the official
    documentation. Example for Ubuntu-based distributions:
    https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-ce

    `sudo apt install docker-ce`

## Running the app with docker
Docker images can be found at [dockerhub](https://hub.docker.com/u/dainst/), 
Dockerfiles and Pipfiles at [github](https://github.com/dainst/cilantro-images). 
To build the images follow the instructions provided in the repository.
To start run

    docker-compose up

To stop the application run:

    docker-compose stop

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

* Run the tests inside the dedicated docker container with the `test/exec_docker_test.sh` script.

*  Alternatively you can run the complete build script out of the
  [build-scripts repository](https://github.com/dainst/build-scripts/).
  After cloing the repo into your workspace, run the following command from within your cilantro directory.

    `../build-scripts/cilantro-build.sh`

This will build, start and stop the docker infrastructure and run the tests.

## Troubleshooting

On Linux hosts the tests will fail because the data directory created by
docker not have the right permissions and the user account that runs the test can not access it. The easiest way to fix that is just to change the owner on the whole directory and subfolders.

    sudo chown -R $(whoami):$(whoami) data/

After that re-run the tests and they may succeed.

## Code style

Cilantro generally uses the [PEP 8 style guide](https://www.python.org/dev/peps/pep-0008/).

Additionally parameters in method docstrings should be given as follows:

    :param param_type param_name: parameter description
