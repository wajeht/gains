run-dev:
	docker compose --file ./docker-compose.dev.yml --env-file ./.env up --build

stop-dev:
	docker compose --file ./docker-compose.dev.yml --env-file ./.env down

clean-dev:
	docker compose --file ./docker-compose.dev.yml --env-file ./.env down -v --rmi all

shell-dev:
	docker compose --file ./docker-compose.dev.yml exec gains sh
