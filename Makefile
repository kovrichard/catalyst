.PHONY: build dev prod sh start-db stop db logs

build:
	docker compose build

dev:
	docker compose down prodapp
	docker compose up -d app database pg_bouncer redis

prod:
	docker compose down app
	docker compose up -d prodapp database pg_bouncer redis

sh:
	docker compose exec app /bin/bash

start-db:
	docker compose up -d database pg_bouncer redis

stop:
	docker compose down

db:
	docker compose exec database psql -U app_dev -d dev

logs:
	docker compose logs -f
