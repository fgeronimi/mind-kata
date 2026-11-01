.DEFAULT_GOAL := help
.PHONY: help install dev build format format-check lint typecheck test test-e2e test-firestore check docker-build docker-run clean

IMAGE ?= mind-kata-web

help: ## Liste les cibles disponibles
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Installe les dépendances (lockfile figé en CI)
	pnpm install $(if $(CI),--frozen-lockfile)

dev: ## Lance les applications en mode développement
	pnpm dev

build: ## Construit toutes les applications et paquets
	pnpm build

format: ## Formate le code avec Prettier
	pnpm format

format-check: ## Vérifie le formatage sans rien modifier
	pnpm format:check

lint: ## Analyse statique du code
	pnpm lint

typecheck: ## Vérifie les types TypeScript
	pnpm typecheck

test: ## Lance les tests unitaires
	pnpm test

test-e2e: ## Parcours dans un vrai navigateur, contre le build de production (après make build)
	pnpm --filter @mind-kata/web test:e2e

# L'émulateur officiel, dans Docker : pas de Java à installer, et jamais la vraie base.
EMULATEUR_FIRESTORE ?= gcr.io/google.com/cloudsdktool/google-cloud-cli:591.0.0-emulators

test-firestore: ## Teste le compteur de budget contre l'émulateur Firestore (Docker)
	@docker run -d --rm --name mind-kata-firestore -p 8086:8086 $(EMULATEUR_FIRESTORE) \
		gcloud emulators firestore start --host-port=0.0.0.0:8086 >/dev/null
	@trap 'docker stop mind-kata-firestore >/dev/null' EXIT; \
		until docker logs mind-kata-firestore 2>&1 | grep -q 'Dev App Server is now running'; do sleep 1; done; \
		FIRESTORE_EMULATOR_HOST=localhost:8086 pnpm --filter @mind-kata/web exec vitest run lib/ia/compteur.test.ts

check: format-check lint typecheck test ## Tout ce que la CI vérifie

docker-build: ## Construit l'image de production (linux/amd64, comme Cloud Run)
	docker build --platform linux/amd64 -t $(IMAGE) .

docker-run: ## Lance l'image sur http://localhost:8080
	docker run --rm --platform linux/amd64 -p 8080:8080 $(IMAGE)

clean: ## Supprime dépendances et artefacts de build
	rm -rf node_modules apps/*/node_modules packages/*/node_modules apps/*/.next apps/*/dist packages/*/dist
