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

shell:
	docker compose --file ./docker-compose.dev.yml exec gains sh

migrate:
	docker compose --file ./docker-compose.dev.yml exec gains sh -c 'npm run migrate:latest'

seed:
	docker compose --file ./docker-compose.dev.yml exec gains sh -c 'npm run seed:run'

wipe:
	docker system prune -a --volumes

fix-git:
	@git rm -r --cached . -f
	@git add .
	@git commit -m "Untrack files in .gitignore"
