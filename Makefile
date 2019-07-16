run:
	docker-compose up

run-detached:
	docker-compose up -d

stop:
	docker-compose stop

down:
	docker-compose down

init: create-data-dir cp-dev-config fix-docker-user

create-data-dir:
	mkdir -p data
	mkdir -p data/staging
	mkdir -p data/staging/test_user
	mkdir -p data/repository
	mkdir -p data/workspace
	mkdir -p archaeocloud_test_dir

build-image:
	./docker_image_build.sh ${IMAGE} ${TAG}

build-doc:
	docker exec cilantro_test doc/build-doc.sh

test: run-detached test-backend test-e2e stop

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
