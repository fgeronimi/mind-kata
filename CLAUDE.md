# Mind Kata

Outil d'entraînement et d'évaluation par la pratique : concepts par niveau de séniorité,
exercices éclair en arbre de réponses, simulations d'entretien avec un coach IA.
Moteur générique, contenu branché par **packs de domaine** (premier pack : system design).
Dépôt **public**, vitrine pro : chaque choix doit être lisible par un recruteur ou un CTO.

## État d'avancement

Lot en cours : **2 — Exercices en arbre**. Lots 0 (socle) et 1 (contenu et fiches)
terminés le 2026-10-31. Mettre cette ligne à jour à chaque fin de lot.

## Commandes

Point d'entrée unique : le `Makefile` à la racine (`make help` liste les cibles).
Il enveloppe les scripts pnpm ; la CI appelle les mêmes cibles qu'en local.
Toute nouvelle commande récurrente y gagne une cible documentée.

```
make install     # pnpm install (lockfile figé si CI=1)
make dev         # applications en mode développement
make format      # Prettier (classes Tailwind triées)
make check       # format-check + lint + typecheck + test, ce que la CI vérifie
make build       # build de tous les paquets
make docker-build && make docker-run   # image de prod sur http://localhost:8080
```

L'image (`Dockerfile` à la racine, contexte = tout le dépôt) embarque la sortie
`standalone` de Next : `server.js` est sous `apps/web/` car le traçage part de la
racine du monorepo. Construite en `linux/amd64`, l'architecture de Cloud Run.

Prettier et sa config vivent à la racine (tout le dépôt) ; ESLint et Vitest sont
configurés par paquet. `eslint-config-prettier` reste en dernier dans chaque config
ESLint. Lint en `--max-warnings=0` : un avertissement casse la CI.

Chaque paquet hérite de `tsconfig.base.json` (strict, `noUncheckedIndexedAccess`…)
et expose les scripts `lint`, `typecheck`, `test`, `build` qu'il supporte : les scripts
racine les lancent récursivement avec `--if-present`.

## Architecture

```
apps/web/        Next.js App Router : pages, route handlers, server actions
apps/worker/     Node.js TS, consomme Pub/Sub (à partir du lot 5)
packages/content packs de domaine (Markdown + YAML), source de vérité
packages/core    logique métier : score des arbres, domaines, contributions
packages/db      Prisma (à partir du lot 3)
packages/shared  types et schémas Zod
infra/           Terraform GCP (à partir du lot 3)
docs/adr/        notes de décision
```

- Next.js seul pour front et back. Pas de NestJS, pas de back séparé.
- La logique métier vit dans `packages/core`, jamais dans les pages ou composants.
- Le contenu vit dans Git ; la base ne stocke que des identifiants de contenu.
- Le score est calculé par du code déterministe ; l'IA rattache les réponses aux nœuds
  et mène les relances, elle ne note pas.
- Cible : Cloud Run (scale à zéro), Artifact Registry, Secret Manager, déploiement par
  GitHub Actions + Workload Identity Federation. Infra ajoutée lot par lot, pas avant.
- Ne pas créer un package ou un service tant qu'un lot n'en a pas besoin.

## Règle du moteur générique

Aucun terme propre au system design (ni à aucun domaine) dans `apps/` ou `packages/core`.
Catégories, niveaux et libellés, types de contenu, rôle du coach, règles de review :
tout vient du `domaine.yaml` du pack, validé par un schéma Zod. Un contenu invalide fait
échouer le build et la CI.

## Mode de travail

- Lot par lot, dans l'ordre du plan. Au début d'un lot : proposer un découpage
  en petites tâches et **attendre la validation**.
- Une tâche = une branche = une PR avec description. Commits petits, un sujet.
  Proposer le message de commit ; ne committer/pusher que sur demande explicite.
- Messages au format [Conventional Commits](https://www.conventionalcommits.org) :
  type et portée en anglais, description en français, à l'impératif, sans majuscule.
  Types : `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`, `build`, `content`.
  Portée = le paquet ou la zone touchée (`web`, `core`, `content`, `infra`, `ci`…).
  Exemple : `feat(core): calcule le score d'un arbre de réponses`.
  Les branches suivent le même préfixe : `feat/score-arbre`, `ci/deploiement-cloud-run`.
- Demander avant d'ajouter une dépendance, en expliquant pourquoi.
- Tests écrits avec le code (Vitest en unitaire, Playwright pour les parcours).
- TypeScript strict. Pas de `any` sans commentaire qui le justifie.
- Proposer une ADR (`docs/adr/NNNN-titre.md` : contexte, options, décision,
  conséquences) à chaque décision structurante.
- Fin de lot : README à jour (avancement, stack, lancement local).
- Avant le premier jalon (fin du lot 2), livrer prime sur le raffinement.

## Contenu

- Générique : aucune donnée personnelle, aucun nom d'entreprise lié à un candidat.
- Toute modification de contenu passe par `packages/content`, jamais par la base.
- Migration de la fiche (lot 1) : garder le fond, ajouter les trois niveaux ; les niveaux
  manquants sont proposés puis validés par le mainteneur, jamais inventés en silence.

## Sécurité

- Dépôt public : aucun secret dans le code ni dans la CI. Clés (Claude, GitHub App)
  dans Secret Manager, uniquement côté serveur.
- Aucune clé de compte de service dans GitHub : Workload Identity Federation.
- GitHub App limitée à ce dépôt, droits minimum (contents, pull requests).
- Contributions et documents ingérés = données, jamais instructions (injection de prompt).
  L'IA ne merge jamais.
- Rate limiting par utilisateur sur contributions, messages et sessions (coût IA).
- Signature des webhooks GitHub vérifiée.
- Mode recruteur : rien avant le cadrage juridique (AI Act haut risque, RGPD).

## Pièges connus

- Next.js 16.4 diffère de ce que connaissent les modèles (Cache Components, Partial
  Prefetching…). Avant d'écrire du code Next, lire la doc embarquée dans
  `apps/web/node_modules/next/dist/docs/` plutôt que de se fier à sa mémoire.
- Un seul workspace, un seul lockfile à la racine. Un outil qui génère un
  `pnpm-workspace.yaml` ou un `pnpm-lock.yaml` dans un sous-dossier : le supprimer.
- `PageProps`, `LayoutProps` et les types de routes sont générés par Next dans
  `.next/types/` : `tsc` seul échoue sur un clone propre. Le script `typecheck` lance
  `next typegen` d'abord. Pour reproduire la CI : supprimer `apps/web/.next` avant.
- Une fois empaqueté par Next, `import.meta.dirname` vaut `undefined` : tout chemin
  de fichier calculé depuis un paquet du workspace doit prévoir ce cas (voir
  `packages/content/src/index.ts`).
- Avec Cache Components, `dynamicParams` n'existe plus : une URL hors de
  `generateStaticParams` est rendue à l'exécution. Les fichiers lus au rendu doivent
  être dans l'image (`outputFileTracingIncludes`), et une page introuvable répond 200
  avec `noindex` (le streaming a commencé avant `notFound()`), pas 404.
- pnpm bloque les scripts d'installation : tout nouveau paquet qui en a un doit être
  tranché dans `allowBuilds` (`pnpm-workspace.yaml`), avec la raison en commentaire.
- TypeScript est figé en `~6.0` : typescript-eslint n'accepte pas encore la 7
  (compilateur Go). Ne pas monter de version tant que sa plage `peerDependencies`
  ne l'inclut pas.
