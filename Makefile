run:
	docker-compose up

run-frontend:
	npm run serve --prefix frontend

run-detached:
	docker-compose up -d

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

lock:
	cd docker/cilantro-convert-worker && pipenv lock
	cd docker/cilantro-default-worker && pipenv lock
	cd docker/cilantro-service && pipenv lock
	cd docker/cilantro-test && pipenv lock
