# Cilantro

Cilantro is a task runner designed to manage long running distributed jobs that
operate on file system objects. Its backend is written in Python (3.6+) and uses
[Celery](http://docs.celeryproject.org/) and [Flask](http://flask.pocoo.org/).
Its frontend is written in JavaScript and uses
[AngularJS](https://angularjs.org/).

## Development

### Prerequisites

* Docker Community Edition
* NodeJS

### Running cilantro

Run this command after first checking out the code:

    make init

Then generate an access token at https://github.com/settings/tokens/new, and add the token to your local .env file.

Run all docker containers with backend services:

    make run

Start the frontend locally:

    make run-frontend

Code changes should be immediatly reflected in the corresponding containers.
The frontend can be accessed under http://localhost:8080/.

To stop the application run:

    make stop

### Documentation

The documentation is automatically generated when a commit is pushed to the
master branch.
The documentation files are held on the special branch `gh-pages`.

The generated HTML can be viewed via the following URL:

https://dainst.github.io/cilantro/

For the in-house CI Jenkins, the generated docu can be found under:

http://oneeyedjacks02.dai-cloud.uni-koeln.de/cilantro-docu/index.html

### Docker images

Dockerfiles for the different services and their dependencies are stored in
the subdirectory `docker/`. The complete stack defined for different
environments is configured with docker-compose files.

To build and publish the images follow the instructions provided in
[the docker README](docker/README.md).

Published docker images can be found at
[dockerhub](https://hub.docker.com/u/dainst/).

### Testing

To start all containers and run all tests call:

    make test

When the application is started with `make run` backend tests can be run
separately with:

    make test-backend

Similarly end-to-end tests that test the whole application with protractor can
be run with:

    make test-e2e

##### Tips

* change promisesDelay-attribute in `frontend/test/e2e/protractor.conf
  to slow tests down if you wanna watch them (eg to 150)

### Monitoring

[Flower](https://flower.readthedocs.io/) is included in the docker config and
is available for debugging under http://localhost:5555.

### Publish Docker Images

To publish a docker image on dockerhub use the buildscript
`docker_image_build.sh` or the commands in it manually.

Every minor release use the version number as image tag. This way it is ensured
the images are always compatible to the corresponding code.

## Troubleshooting

On Linux hosts the tests will fail because the data directory created by
docker does not have the right permissions and the user account that runs the
tests can not access it. The easiest way to fix that is just to change the owner
on the whole directory and subfolders. The Makefile offers a short command for
this:

    make fix-permissions

After that re-run the tests and they may succeed.

In case of duplicate entries in the database clean your test containers with:

    docker-compose down

## Code style

### Python

Cilantro generally uses the
[PEP 8 style guide](https://www.python.org/dev/peps/pep-0008/).

Additionally parameters in method docstrings should be given as follows:

    :param param_type param_name: parameter description
    :raises ErrorType: Exception throw-condition description

### JavaScript

- indentation: 4 spaces instead of tab
    - idea: settings->editor->javascript
    - atom: settings->editor
- names
    - for js-variables: camelCase
    - for members of datamodel (dataset, article): under_score
    - in css: snake-case
    - filenames and module names: under_score,
      eg: myController in my_controller.js
- ES6
    - `let/const` instead of `var` where it makes sense:
      http://es6-features.org/#BlockScopedVariables
    - arrow function whenever function is not local and [this]-scope is not
      needed
- more    
    - `===` instead of `==`
    - line endings with `;` even after `}`
    - if without {} only in very simple one liners
