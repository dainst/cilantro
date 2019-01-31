run:
	docker-compose up

run-detached:
	docker-compose up -d

stop:
	docker-compose stop

build-image:
	./docker_image_build.sh ${IMAGE} ${TAG}

build-doc:
	bash doc/build-doc.sh

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

cp-default-config:
	cp .env-default .env
	cp config/users.yml-default config/users.yml
	mkdir frontend/config
	cp config/settings.default.json frontend/config/settings.json

fix-docker-user:
	$(shell sed -i 's/user_id_placeholder/$(shell id -u)/g' .env)
	$(shell sed -i 's/user_group_placeholder/$(shell id -g)/g' .env)
