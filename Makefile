
# Target directories and files
TIMESTAMP := $(shell date "+%Y-%m-%d_%H-%M-%S")
LOGFILE := ${TARGET}/app-${TIMESTAMP}.log
ERRFILE := ${TARGET}/err-${TIMESTAMP}.log

# Docker configuration files
DOCKER_COMPOSE_DEV=./docker-compose.dev.yml
DOCKER_COMPOSE_PROD=./docker-compose.prod.yml


# ==== PHONY TARGETS ========================================================= #
# Don't treat these targets as files
.PHONY: all local dev release stop prune


# ==== DEV TARGETS ================ #
# Default behaviour: local
all: local
# LOCAL: run Docker Mongo instance and local Express server (no Docker).
# Run docker compose in detached mode (-d) to avoid messing up the terminal.
# To inject the .env file locally (on docker, compose injects it):
# 	- cat the env file filtering the commented lines with grep
#	- substitute (s/) \r ($ denotes line end) characters with sed
#	- convert standard input to command arguments with xargs
#	- run the module in a modified environment with exported variables
local:
	docker compose -f ${DOCKER_COMPOSE_DEV} up -d grasso-mongo
	env $$(cat .env | grep -v '^#' | sed 's/\r$$//' | xargs -r) npm start

# DEV: run docker-compose dev configuration and keep terminal (nohup ... &).
# Use `make stop` to kill the containers.
# --build forces to rebuild the docker image before deploying.
dev: ${TARGET} stop
#nohup docker-compose -f ${DOCKER_COMPOSE_DEV} up --build > ${LOGFILE} 2> ${ERRFILE} &
	docker compose -f ${DOCKER_COMPOSE_DEV} up --build

# Stop running containers
stop:
	docker compose -f ${DOCKER_COMPOSE_DEV} down

# Prune Docker system
#! WARNING: removes all non-running containers and images
prune:
	docker system prune -a -f


# ==== PROD TARGETS =============== #
# RELEASE: run pipleine and release in production
release:
	sudo bash ../jenkins.sh ./