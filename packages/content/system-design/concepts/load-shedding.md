---
id: load-shedding
terme: "Load shedding"
alias: ["délestage", "salle d'attente virtuelle"]
categorie: resilience
liens: [rate-limiting, backpressure, circuit-breaker]
niveaux:
  confirme: "Sait qu'en surcharge on refuse volontairement une partie des requêtes pour que le reste soit servi."
  senior: "Met en place une salle d'attente ou un rejet priorisé (les requêtes critiques passent, le reste attend), avec une réponse claire à l'utilisateur."
  lead: "Définit avec le métier ce qui est prioritaire en cas de surcharge, et prépare le délestage avant les pics annoncés."
---

Quand la demande dépasse ce que le système tient, mieux vaut **servir correctement une
partie** des utilisateurs que de tous les servir mal, puis de tomber.

## Formes

- **Rejet** au-delà d'un seuil (503 avec `Retry-After`).
- **Priorités** : les parcours critiques passent, les fonctions secondaires sont coupées.
- **Salle d'attente virtuelle** : les utilisateurs sont admis à un débit que le système
  tient, et voient leur position.

## Pièges

- Le seuil se mesure par un test de charge, pas à l'intuition.
- Un rejet sans explication pousse l'utilisateur à recharger, et aggrave la surcharge.
