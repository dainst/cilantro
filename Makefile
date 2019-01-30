run:
	docker-compose up

run_detached:
	docker-compose up -d

stop:
	docker-compose stop

build-image:
	./docker_image_build.sh ${IMAGE} ${TAG}

build-doc:
	bash doc/build-doc.sh

run-backend-tests: run_detached
	bash test/exec_docker_test.sh

run-frontend-tests:
	npm run --prefix frontend e2e

fix-data-permissions:
	sudo chown -R $(whoami):$(whoami) data/
	sudo chown -R $(whoami):$(whoami) archaeocloud_test_dir/

rm-ds-store:
	find . -name '.DS_Store' -type f -delete

cp-default-config:
	cp .env-default .env
	cp config/users.yml-default config/users.yml

fix-docker-user:
	$(shell sed -i 's/user_id_placeholder/$(shell id -u)/g' .env)
	$(shell sed -i 's/user_group_placeholder/$(shell id -g)/g' .env)

run-all-tests: run_detached run-backend-tests run-frontend-tests stop
