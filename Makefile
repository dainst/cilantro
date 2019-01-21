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

run-frontend-tests: run_detached
	bash frontend/test/exec_frontend_test.sh

fix-data-permissions:
	sudo chown -R $(whoami):$(whoami) data/

rm-ds-store:
	find . -name '.DS_Store' -type f -delete

cp-default-config:
	cp .env-default .env
	cp config/users.yml-default config/users.yml

run-all-tests: run_detached run-backend-tests run-frontend-tests stop
