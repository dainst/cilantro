# Cilantro

Cilantro is a task runner designed to manage long running distributed jobs that
operate on file system objects. Its backend is written in Python (3.6+) and uses
[Celery](http://docs.celeryproject.org/) and [Flask](http://flask.pocoo.org/).
Its frontend is written in JavaScript and uses
[VueJS](https://vuejs.org/).

## Development

### Prerequisites

* Docker Community Edition
* NodeJS

#### For Windows Users:

Since the following process relies on make and uses bash related commands it can't be used in a Windows-Shell. The easiest way to circumvent this problem is to make use of the WSL-System of Windows 10 Pro. If you don't have Windows 10 Pro, go get Windows 10 Pro, also Docker dosn't work flawlessly without it.

Expecting that you have Win10 Pro, you need to activate the Linux Subsystem Feature and Install Ubuntu 18.04 or what ever Version is available by the time you read this. If your Ubuntu-Subsystem is up and running, open it and start installing the requierments. Begin with nodejs and pip3 for python

    sudo apt update
    sudo apt install nodejs python3-pip

After that start following this instruction very carefully, since you are going to setup a linux in a virtual environment communication with a docker in another environment running an linux serving an Webserver there are a lot of possibilities of mistakes.

https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly

After you done with that you are good to go on with the rest of this instructions.

Also, if you are developing with VSCode, there is a WSL Extension for that IDE available which works very well, gives you the possibilitie to use the linux subsystem from within VSCode, see: https://code.visualstudio.com/docs/remote/wsl

### Running cilantro

Run this command after first checking out the code:

    make init

Then generate an access token at https://github.com/settings/tokens/new (you don't need to tick any of the scope boxes), and add the token to your local .env file.

Edit the .env file and replace the UID placeholders with your UID and GID. You can get these with the command `id -u && id -g`

Run all docker containers with backend services:

    make run

Start the frontend locally:

    make run-frontend

Code changes should be immediatly reflected in the corresponding containers.
The frontend can be accessed under http://localhost:8080/.

To stop the application run:

    make stop

If you have old container relics and encounter errors run:

    docker-compose build

### User management

For now users are managed via the file `config/users.yml`. Every user is able to
login and start new jobs. Passwords in this file are encrypted with bcrypt.

You can [generate a bcryt-hash here](https://bcrypt-generator.com/).

After changing the `config/users.yml` the service has currently to be restarted in order to reload the file.


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

Analogous frontend tests can be started with

    make test-frontend

Similarly end-to-end tests that test the whole application with protractor can
be run with:

    make test-e2e

Single tests can be run with:

    docker exec cilantro_test python -m unittest module.path.to.TestCase

e.g.

    docker exec cilantro_test python -m unittest test.unit.worker.convert.test_cut_pdf.CutPdfTest

### Poetry, Docker and Dependencies

To add or update a python dependency in one of the images, you can first add or update the `pyproject.toml` file for the service in `docker/<service/`.

Then generate a fitting `poetry.lock` file with a run command:

```bash
docker-compose run --rm --entrypoint '' -u root -w "/poetry" -v "$(pwd)/docker/cilantro-nlp-worker:/poetry" nlp-worker poetry update
```

(Change `nlp-worker` in both the volume definition and the container name to the service you need.)

This will use a temporary container to change the `poetry.lock` in the repo. You can now do a `docker-compose build` to update your container.

Change `poetry update` to e.g. `poetry add <dependency>` to change both the `pyproject.toml` as well as the `poetry.lock`.

### Tips

* change promisesDelay-attribute in `frontend/test/e2e/protractor.conf
  to slow tests down if you wanna watch them (eg to 150)

### Monitoring

[Flower](https://flower.readthedocs.io/) is included in the docker config and
is available for debugging under http://localhost:5555.

OJS monitoring under http://localhost:4444

### Additional docker-compose configurations

#### Local OMP instance

If you have checked out [omp-docker](https://github.com/dainst/omp-docker) and want to develop against its running instance (instead of the default mock server), you can do so by using the provided [docker-compose.local_omp.yml](docker-compose.local_omp.yml) by running `make run-local-omp`.

You need to setup your credentials according to https://github.com/dainst/ojs-cilantro-plugin. 

#### Local OJS instance

If you have checked out [ojs-docker](https://github.com/dainst/ojs-docker) and want to develop against its running instance (instead of the default mock server), you can do so by using the provided [docker-compose.local_ojs.yml](docker-compose.local_ojs.yml) by running `make run-local-ojs`.

You need to setup your credentials according to https://github.com/dainst/ojs-cilantro-plugin.
 
## Deployment

### Build images

New images for test or production can be build by calling the `docker_image_build.sh` with one of the service names in the `docker-compose.build.yml` (also a dir name below `/docker`).

You need to be logged in to DockerHub with an account that can access the `/dainst` organization, e.g.:

```
docker login
./docker_image_build.sh cilantro-convert-worker
```

or to build without using the cache:

```
./docker_image_build.sh cilantro-convert-worker no-cache
```

This will increment the version number of the published image (the version no. is tagged on DockerHub and kept in the `VERSION` file below the directories in `docker`).

### Portainer

To publish to the [test](portainer.test.idai.world)/prod[portainer.idai.world] portainers:

* Adjust version numbers in `docker-compose.test.yml`, `docker-compose.prod.yml`
* Paste the contents of these files in the Portainers Stack editor (Stacks > workbench > Editor > Paste > Update the Stack) 

To redeploy, you can simply remove all service and add them again:

* Portainer > Stacks > workbench > Mark all services > Remove
* Editor (top of sampe page) > Update the stack

#### Portainer volumes

On an empty portainer, one volume would have to be created inside the Portainer for each volume marked as `external: true` in the `docker.compose.<env>.yml`.

* Portainer > Volumes > Add volume

Most of these volumes can use an external volume configured with e.g. these options (example for the staging folder in prod):

```
device  :/volume3/bcloud03/idaiworld-scans/idaiworkbench/staging
type    nfs
o       addr=10.201.0.95,rw,noatime,rsize=8192,wsize=8192,tcp,timeo=14
```

However the volume with the mongo database files for the `job-db` service _should not use an NFS volume_ (Keep the default options for a local volume) as that led to performance problems.



## Troubleshooting

* On Linux hosts the tests will fail because the data directory created by
docker does not have the right permissions and the user account that runs the
tests can not access it. The easiest way to fix that is just to change the owner
on the whole directory and subfolders. The Makefile offers a short command for
this:

    make fix-permissions

After that re-run the tests and they may succeed.

* In case of duplicate entries in the database clean your test containers with:

    docker-compose down

* If you run into an error using `make run-frontend`on mac, run `softwareupdate --install -a` to update the whole system to the newest state. If the error remains, check if it is this Error-Code: `getaddrinfo ENOTFOUND x86_64-apple-darwin13.4.0`, if so use the command `unset HOST`and retry the make call.

* On Mac's on can encounter an error after running `make run-frontend` of that kind

    getaddrinfo ENOTFOUND x86_64-apple-darwin13.4.0

    to fix this one needs to run the command `unset HOST` in the Terminal and re-run the `make run-frontend` command.


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
