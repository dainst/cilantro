# cilantro-images
Docker images for dainst/cilantro, found at [dockerhub](https://hub.docker.com/r/dainst/).

## Installation
Copy the `.env-default` file to `.env` and enter your github_access_token there.
## Instructions
To build a new image or to rebuild it run the build script

        `./build.sh <name> <tag>`
Make sure to provide the right name and tag to the script. 
Tag defaults to latest.

This tags are currently used:
* stable
* dev

You can use your own tag for developing, e.g. the name of your feature branch.

New repositories is automatically created if your permissions are sufficient.
Make sure to provide a description for them at dockerhub!
