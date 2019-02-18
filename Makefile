run:
	docker-compose up

run-detached:
	docker-compose up -d

stop:
	docker-compose stop

init: create-data-dir fix-docker-user cp-dev-config install-frontend-deps

init-ci: create-data-dir cp-ci-config install-frontend-deps

create-data-dir:
	mkdir -p data
	mkdir -p data/staging
	mkdir -p data/staging/test_user
	mkdir -p data/repository
	mkdir -p data/workspace
	mkdir -p archaeocloud_test_dir

install-frontend-deps:
	npm install --prefix frontend

build-image:
	./docker_image_build.sh ${IMAGE} ${TAG}

build-doc:
	docker exec cilantro_test_1 doc/build-doc.sh

test: run-detached test-backend test-e2e stop

test-backend:
	docker exec cilantro_test_1 python -m unittest -v $1

test-e2e:
	npm run --prefix frontend e2e

fix-permissions:
	sudo chown -R $(whoami):$(whoami) data/
	sudo chown -R $(whoami):$(whoami) archaeocloud_test_dir/

rm-ds-store:
	find . -name '.DS_Store' -type f -delete

cp-ci-config:
	cp .env-default .env
	cp config/users.yml-default config/users.yml
	mkdir -p frontend/config
	cp config/settings.travis.json frontend/config/settings.json

cp-dev-config:
	cp .env-default .env
	cp config/users.yml-default config/users.yml
	mkdir -p frontend/config
	cp config/settings.default.json frontend/config/settings.json

fix-docker-user:
	$(shell sed -i 's/user_id_placeholder/$(shell id -u)/g' .env)
	$(shell sed -i 's/user_group_placeholder/$(shell id -g)/g' .env)
