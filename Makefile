.PHONY: db

db:
	docker compose exec database psql -U app_dev -d dev
