NAME = otable
VERSION = 1.0
CUR_DIR = $(shell basename $(CURDIR))
CURRENT_BRANCH ?= $(shell git rev-parse --abbrev-ref HEAD)
DOCKER_FILE ?= docker-compose.yml

.PHONY: start dev_up composer bower dbmigrate

info:
	$(info CURRENT_BRANCH: $(CURRENT_BRANCH))
	$(info DOCKER_FILE: $(DOCKER_FILE))

dev-up:
	docker-compose -f $(DOCKER_FILE) up -d --remove-orphans
	npm run start:dev

dev-up-debug:
	docker-compose -f $(DOCKER_FILE) up -d --remove-orphans
	npm run start:debug

down:
	docker-compose -f $(DOCKER_FILE) down

deploy-dev:
	echo "=== Pls use private password ==="
	caprover deploy -d -h https://captain.o-geek.geekup.io -a api -b develop