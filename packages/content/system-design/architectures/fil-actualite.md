---
id: fil-actualite
titre: Fil d'actualité
probleme: Afficher à chacun les publications des comptes qu'il suit
briques:
  - fan-out à l'écriture
  - fan-out à la lecture pour les très gros comptes
  - cache des fils
concepts: [idempotence]
---

```mermaid
flowchart LR
  P["Publication"] --> T{"Gros compte ?"}
  T -->|non| FW["Fan-out à l'écriture"] --> C[("Fils précalculés")]
  T -->|oui| G[("Publications des gros comptes")]
  L["Lecture d'un fil"] --> C
  L -->|fusion à la lecture| G
```

## Quand

Beaucoup plus de lectures que d'écritures, et une distribution très inégale du nombre
d'abonnés.

## Points d'attention

- **Fan-out à l'écriture** : chaque publication est recopiée dans le fil de chaque
  abonné. Lecture instantanée, écriture coûteuse.
- **Fan-out à la lecture** : le fil est assemblé à la demande. Indispensable pour les
  comptes à millions d'abonnés.
- L'**hybride** des deux est la réponse attendue.
- Le classement (chronologique ou pertinence) change tout le reste : le demander.
