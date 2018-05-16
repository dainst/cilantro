# Cilantro

Cilantro is a task runner designed to manage long running distributed jobs that
operate on file system objects. It is written in Python (3.6+) and uses
[Celery](http://docs.celeryproject.org/) and [Flask](http://flask.pocoo.org/).

## Install
Copy the `.env-default` file to `.env` and modify it, do the same thing with `test/integration/env-default.py`.
## Running the app with docker

    docker-compose build
    docker-compose up

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
Use

    pip3 install -r test/requirements.txt
    python3 -m unittest
or

    pip install -r test/requirements.txt
    python -m unittest

if your python is defaulted to `v3`.

## Troubleshooting

On Linux hosts the tests will fail because the data directory created by
docker will not have the right permissions. The easiest way to fix that is
just to change the permissions on the whole directory and subfolders.

    chmod -R 777 data

After that re-run the tests and they may succeed.
