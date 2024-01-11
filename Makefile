THIS_FILE := $(lastword $(MAKEFILE_LIST))

.PHONY: help build up start down destroy stop restart logs logs-api ps login-api login-kafka coverage deps lint push test

help:
	@echo "Available targets:"
	@echo "  build              Build Docker images"
	@echo "  up                 Start Docker containers in the background"
	@echo "  start              Start Docker containers"
	@echo "  down               Stop and remove Docker containers"
	@echo "  destroy            Stop and remove Docker containers along with volumes"
	@echo "  stop               Stop Docker containers"
	@echo "  restart            Restart Docker containers"
	@echo "  logs               View Docker container logs"
	@echo "  logs-api           View logs for the 'fastapi_app' container"
	@echo "  ps                 List Docker containers"
	@echo "  login-api          Open a bash shell in the 'fastapi_app' container"
	@echo "  login-kafka        Open a bash shell in the 'kafka' container"
	@echo "  coverage           Run coverage tests and generate a report"
	@echo "  deps               Install Python dependencies"
	@echo "  lint               Run code formatting and linting tools"
	@echo "  push               Push changes to the remote repository"
	@echo "  test               Run pytest for testing"

build:
	docker-compose -f docker-compose.yml build $(c)

up:
	docker-compose -f docker-compose.yml up -d $(c)

start:
	docker-compose -f docker-compose.yml start $(c)

down:
	docker-compose -f docker-compose.yml down $(c)

destroy:
	docker-compose -f docker-compose.yml down -v $(c)

stop:
	docker-compose -f docker-compose.yml stop $(c)

restart:
	docker-compose -f docker-compose.yml stop $(c)
	docker-compose -f docker-compose.yml up -d $(c)

logs:
	docker-compose -f docker-compose.yml logs --tail=100 -f $(c)

logs-api:
	docker-compose -f docker-compose.yml logs --tail=100 -f fastapi_app

ps:
	docker-compose -f docker-compose.yml ps

login-api:
	docker-compose -f docker-compose.yml exec fastapi_app /bin/bash

login-kafka:
	docker-compose -f docker-compose.yml exec kafka /bin/bash

# db-shell:
# 	docker-compose -f docker-compose.yml exec timescale psql -Upostgres

coverage: 
	coverage erase
	coverage run --include=dadata/* -m pytest -ra
	coverage report -m

deps: 
	pip install black coverage flake8 mypy pylint pytest tox

lint:  
	isort .
	pylint backend  
	mypy backend
	flake8 backend 

push:  
	git push && git push --tags

test: 
	pytest -ra
