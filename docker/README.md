# cilantro-images
Docker images for dainst/cilantro, found at [dockerhub](https://hub.docker.com/r/dainst/).

## Building & publishing docker images

### Prerequisites

Copy the `.env-default` file to `.env` and enter your github_access_token there.

Login to dockerhub:

    docker login

### Instructions
Images can be built by

    docker-compose build <image-name>

If `image-name` is blank it builds all images.

Alternative:

This includes the push to dockerhub.
To build a new image or to rebuild it run the build script

    ./build.sh <image-name>

The script will also push the built image to Docker Hub, using the 'latest'
tag.
Additionally it will push a tag using the version string of the container which
is kept in the file 'VERSION' in the container's subdirectory. Before building
the content of the file is automatically incremented by one.

You can append `--no-cache` option if you don't want to use your docker cache.
