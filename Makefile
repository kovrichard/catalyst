.PHONY: build dev sh start-db stop db

build:
	docker compose build

dev:
	docker compose up -d

sh:
	docker compose exec app /bin/bash

start-db:
	docker compose up -d database

stop:
	docker compose down

db:
	docker compose exec database psql -U app_dev -d dev

logs:
	docker compose logs -f app
