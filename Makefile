run:
	docker-compose up

stop:
	docker-compose stop

build-image:
	./build.sh IMAGE TAG

build-doc:
	bash doc/build-doc.sh

run-tests:
	docker-compose up -d
	bash test/exec_docker_test.sh
	docker-compose stop

fix-data-permissions:
	sudo chown -R $(whoami):$(whoami) data/

rm-ds-store:
	find . -name '.DS_Store' -type f -delete

cp-default-config:
	cp .env-default .env
	cp config/users.yml-default config/users.yml
