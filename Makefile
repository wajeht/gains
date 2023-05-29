up-d:
	docker compose --file ./docker-compose.dev.yml --env-file ./.env down -v --rmi all
	docker compose --file ./docker-compose.dev.yml --env-file ./.env up -d --build

build:
	docker compose --file ./docker-compose.dev.yml --env-file ./.env down -v --rmi all
	docker compose --file ./docker-compose.dev.yml --env-file ./.env up --build

up:
	docker compose --file ./docker-compose.dev.yml --env-file ./.env up

down:
	docker compose --file ./docker-compose.dev.yml --env-file ./.env down

clean:
	docker compose --file ./docker-compose.dev.yml --env-file ./.env down -v --rmi all

shell-dev-gains:
	docker compose --file ./docker-compose.dev.yml exec gains sh

shell-dev-db:
	docker compose --file ./docker-compose.dev.yml exec postgres sh

shell-dev-redis:
	docker compose --file ./docker-compose.dev.yml exec redis sh

wipe:
	docker system prune -a --volumes
