run:
	docker-compose up

run-frontend:
	npm run serve --prefix frontend

run-detached:
	docker-compose up -d

run-local-omp:
	docker-compose -f docker-compose.yml -f docker-compose.local_omp.yml up

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
	make run-detached

	rm -f docker/cilantro-service/Pipfile.lock
	docker exec -w /app/docker/cilantro-service -u root:root cilantro_service pipenv --clear --rm install

	rm -f docker/cilantro-default-worker/Pipfile.lock
	docker exec -w /app/docker/cilantro-default-worker -u root:root cilantro_default_worker pipenv --clear --rm install

	rm -f docker/cilantro-convert-worker/Pipfile.lock
	docker exec -w /app/docker/cilantro-convert-worker -u root:root cilantro_convert_worker pipenv --clear --rm install

	rm -f docker/cilantro-nlp-heideltime-worker/Pipfile.lock
	docker exec -w /app/docker/cilantro-nlp-heideltime-worker -u root:root cilantro_nlp_heideltime_worker pipenv --clear --rm install

	rm -f docker/cilantro-nlp-worker/Pipfile.lock
	docker exec -w /app/docker/cilantro-nlp-worker -u root:root cilantro_nlp_worker pipenv --clear --rm install

	rm -f docker/cilantro-test/Pipfile.lock
	docker exec -w /app/docker/cilantro-test -u root:root cilantro_test pipenv --clear --rm install
