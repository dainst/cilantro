# cilantro-images
Docker images for dainst/cilantro, found at [dockerhub](https://hub.docker.com/r/dainst/).

## Instructions
To build a new image or to rebuild it run
```
docker image build -t <name> <folder>
```
with the name and the folder of your image, e.g. cilantro-test.

If it is a new image you need to tag it with
```
docker tag <name> dainst/<name>
```
Push your new or modified image to dockerhub with
```
docker login
docker push dainst/<name>
```
The repository is automatically created if you permissions are sufficient.
Make sure to provide a description!
