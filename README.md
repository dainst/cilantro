# cilantro-images
Docker images for dainst/cilantro, found at [dockerhub](https://hub.docker.com/r/dainst/).

## Building & publishing docker images

### Prerequisites

Copy the `.env-default` file to `.env` and enter your github_access_token there.

Login to dockerhub:

    docker login

### Instructions

To build a new image or to rebuild it run the build script

    `./build.sh <image-name> <tag>`

Tag defaults to stable.

You should use your own tag for developing, e.g. the name of your feature branch.

New repositories are automatically created on dockerhub if your permissions are sufficient.
Make sure to provide a description for them at dockerhub!
