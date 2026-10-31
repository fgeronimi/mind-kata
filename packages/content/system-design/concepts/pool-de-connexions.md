---
id: pool-de-connexions
terme: "Pool de connexions"
alias: ["connection pool", "PgBouncer"]
categorie: infrastructure
liens: [autoscaling, loi-de-little]
niveaux:
  confirme: "Sait qu'ouvrir une connexion à la base coûte cher, et qu'on réutilise un ensemble de connexions ouvertes."
  senior: "Dimensionne le pool selon la capacité de la base, place un gestionnaire de connexions devant elle quand les instances se multiplient, et sait que l'autoscaling peut épuiser les connexions."
  lead: "Inclut les limites de connexions dans tout calcul de capacité, et les surveille comme un indicateur de saturation."
---

Ouvrir une connexion à la base coûte cher : chaque instance garde un **ensemble de
connexions ouvertes** et les réutilise.

## Le piège de l'autoscaling

Vingt instances avec un pool de vingt connexions, c'est quatre cents connexions : la base
en accepte souvent moins. Un **gestionnaire de connexions** placé devant la base les
mutualise.

## Dimensionner

Loi de Little : connexions nécessaires ≈ requêtes par seconde × durée d'une requête.
