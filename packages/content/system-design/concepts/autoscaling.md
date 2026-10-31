---
id: autoscaling
terme: "Autoscaling"
alias: ["mise à l'échelle automatique"]
categorie: infrastructure
liens: [scalabilite, sans-etat, pool-de-connexions, backpressure]
niveaux:
  confirme: "Sait qu'on peut ajouter ou retirer des instances automatiquement selon la charge."
  senior: "Le configure sur une métrique pertinente (requêtes, profondeur de file plutôt que seul processeur), avec des minimums et maximums, et vérifie que les dépendances (base, tiers) suivent la montée."
  lead: "Préchauffe la capacité avant les pics annoncés plutôt que de compter sur la réactivité, et plafonne la montée pour maîtriser les coûts."
---

Le nombre d'instances suit la charge : plus en pic, moins (voire zéro) au repos.

## Comment

- Une métrique pertinente : requêtes en cours, **profondeur de file** pour les workers,
  pas seulement le processeur.
- Un minimum (temps de démarrage) et un **maximum** (coûts, dépendances).
- Des instances sans état.

## Pièges

- La base et les tiers ne suivent pas : plus d'instances, c'est aussi plus de connexions.
- L'autoscaling réagit en minutes : un pic annoncé se préchauffe.
