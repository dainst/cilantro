run:
	docker-compose up

run-frontend:
	npm run serve --prefix frontend

run-detached:
	docker-compose up -d

run-local-omp:
	docker-compose -f docker-compose.yml -f docker-compose.local_omp.yml up

run-local-ojs:
	docker-compose -f docker-compose.yml -f docker-compose.local_ojs.yml up

stop:
	docker-compose stop

down:
	docker-compose down

init: create-data-dir cp-dev-config fix-docker-user install-frontend-deps

create-data-dir:
	mkdir -p data
	mkdir -p data/staging
	mkdir -p data/staging/test_user
	mkdir -p data/repository
	mkdir -p data/archive
	mkdir -p data/workspace
	mkdir -p archaeocloud_test_dir

install-frontend-deps:
	npm install --prefix frontend

# example: "make build-image" to build all, or "make build-image IMAGE=cilantro-service" to build single image
build-image:
	./docker_image_build.sh ${IMAGE} ${TAG} 

build-doc:
	docker exec cilantro_test doc/build-doc.sh

test: run-detached test-backend test-frontend stop

test-frontend:
	npm run test:unit --prefix frontend

test-backend:
	docker exec cilantro_test python -m unittest discover test.unit -vf
	docker exec cilantro_test python -m unittest discover test.integration -vf

fix-permissions:
	sudo chown -R $(whoami):$(whoami) data/
	sudo chown -R $(whoami):$(whoami) archaeocloud_test_dir/

rm-ds-store:
	find . -name '.DS_Store' -type f -delete

cp-dev-config:
	cp .env-default .env
	cp config/users.yml-default config/users.yml

fix-docker-user:
	$(shell sed -i 's/user_id_placeholder/$(shell id -u)/g' .env)
	$(shell sed -i 's/user_group_placeholder/$(shell id -g)/g' .env)

create-pipenv-locks:
	docker build --target base -t dainst/cilantro-service-base -f docker/cilantro-service/Dockerfile .
	docker run -v $(shell pwd)/docker/cilantro-service:/out/ --rm dainst/cilantro-service-base /bin/sh -c "pipenv install && cp /Pipfile.lock /out/Pipfile.lock"

	docker build --target base -t dainst/cilantro-default-worker-base -f docker/cilantro-default-worker/Dockerfile .
	docker run -v $(shell pwd)/docker/cilantro-default-worker:/out/ --rm dainst/cilantro-default-worker-base /bin/sh -c "pipenv install && cp /Pipfile.lock /out/Pipfile.lock"

	docker build --target base -t dainst/cilantro-convert-worker-base -f docker/cilantro-convert-worker/Dockerfile .
	docker run -v $(shell pwd)/docker/cilantro-convert-worker:/out/ --rm dainst/cilantro-convert-worker-base /bin/sh -c "pipenv install && cp /Pipfile.lock /out/Pipfile.lock"

	docker build --target base -t dainst/cilantro-nlp-heideltime-worker-base -f docker/cilantro-nlp-heideltime-worker/Dockerfile .
	docker run -v $(shell pwd)/docker/cilantro-nlp-heideltime-worker:/out/ --rm dainst/cilantro-nlp-heideltime-worker-base /bin/sh -c "pipenv install && cp /Pipfile.lock /out/Pipfile.lock"

	docker build --target base -t dainst/cilantro-nlp-worker-base -f docker/cilantro-nlp-worker/Dockerfile .
	docker run -v $(shell pwd)/docker/cilantro-nlp-worker:/out/ --rm dainst/cilantro-nlp-worker-base /bin/sh -c "pipenv install && cp /Pipfile.lock /out/Pipfile.lock"

	docker build --target base -t dainst/cilantro-test-base -f docker/cilantro-test/Dockerfile .
	docker run -v $(shell pwd)/docker/cilantro-test:/out/ --rm dainst/cilantro-test-base /bin/sh -c "pipenv install && cp /Pipfile.lock /out/Pipfile.lock"

