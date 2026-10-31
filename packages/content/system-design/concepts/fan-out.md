---
id: fan-out
terme: "Fan-out"
alias: ["diffusion en éventail"]
categorie: messagerie
liens: [pub-sub]
niveaux:
  confirme: "Sait qu'un même événement est distribué à de nombreux destinataires."
  senior: "Choisit entre fan-out à l'écriture (lecture rapide) et à la lecture (écriture légère), selon la répartition des destinataires."
  lead: "Retient l'approche hybride pour les cas très inégaux, en en chiffrant le coût de stockage et de calcul."
---

Un événement, de nombreux destinataires : c'est le cas du fil d'actualité ou des
notifications.

- **À l'écriture** : on recopie tout de suite chez chaque destinataire. Lecture
  instantanée, écriture coûteuse.
- **À la lecture** : on assemble à la demande. Indispensable pour les comptes à millions
  d'abonnés.

## Piège

Une distribution très inégale impose souvent l'hybride.
