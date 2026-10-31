---
id: traitement-asynchrone
titre: Traitement asynchrone
probleme: Tâches longues ou pics de dépôt (génération de documents, analyses, e-mails)
briques:
  - accusé de réception immédiat
  - file de messages
  - workers
  - file d'échecs
  - page de statut
concepts: [idempotence, retry-backoff, outbox]
---

```mermaid
flowchart LR
  U["Utilisateur"] -->|demande| API["API"]
  API -->|"enregistre (source de vérité)"| B[("Base")]
  API -->|publie| F[["File"]]
  API -->|"202 + numéro de suivi"| U
  F --> W1["Worker"]
  F --> W2["Worker"]
  W1 & W2 -->|met à jour le statut| B
  F -. échecs répétés .-> DLQ[["File d'échecs"]]
  U -->|consulte| S["Page de statut"] --> B
```

## Quand

Le traitement prend plus de quelques secondes, dépend d'un tiers, ou arrive par vagues.
L'utilisateur n'a pas à attendre, et la charge est lissée.

## Points d'attention

- La **base est la source de vérité**, la file n'est qu'un transport : une tâche de
  rattrapage republie ce qui est resté en attente.
- Les workers reçoivent un message au moins une fois : traitement **idempotent**.
- Retries avec backoff, puis file d'échecs pour les vraies erreurs.
- Loi de Little pour dimensionner : traitements simultanés = débit × durée.
- L'utilisateur voit un statut horodaté, pas un écran figé.
