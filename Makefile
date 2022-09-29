run-dev-build-d:
	docker compose --file ./docker-compose.dev.yml --env-file ./.env down -v --rmi all
	docker compose --file ./docker-compose.dev.yml --env-file ./.env up -d --build

run-dev-build:
	docker compose --file ./docker-compose.dev.yml --env-file ./.env down -v --rmi all
	docker compose --file ./docker-compose.dev.yml --env-file ./.env up --build

run-dev:
	docker compose --file ./docker-compose.dev.yml --env-file ./.env up

stop-dev:
	docker compose --file ./docker-compose.dev.yml --env-file ./.env down

clean-dev:
	docker compose --file ./docker-compose.dev.yml --env-file ./.env down -v --rmi all

shell-dev-gains:
	docker compose --file ./docker-compose.dev.yml exec gains sh

shell-dev-db:
	docker compose --file ./docker-compose.dev.yml exec postgres sh

shell-dev-redis:
	docker compose --file ./docker-compose.dev.yml exec redis sh
