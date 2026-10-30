.DEFAULT_GOAL := help
.PHONY: help install dev build lint typecheck test check clean

help: ## Liste les cibles disponibles
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Installe les dépendances (lockfile figé en CI)
	pnpm install $(if $(CI),--frozen-lockfile)

dev: ## Lance les applications en mode développement
	pnpm dev

build: ## Construit toutes les applications et paquets
	pnpm build

lint: ## Analyse statique du code
	pnpm lint

typecheck: ## Vérifie les types TypeScript
	pnpm typecheck

test: ## Lance les tests unitaires
	pnpm test

check: lint typecheck test ## Tout ce que la CI vérifie

clean: ## Supprime dépendances et artefacts de build
	rm -rf node_modules apps/*/node_modules packages/*/node_modules apps/*/.next apps/*/dist packages/*/dist
