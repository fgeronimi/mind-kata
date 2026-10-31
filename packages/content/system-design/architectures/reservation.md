---
id: reservation
titre: Réservation d'une ressource rare
probleme: Créneaux, places ou stocks limités que plusieurs personnes convoitent en même temps
briques:
  - réservation temporaire avec expiration
  - verrouillage optimiste ou pessimiste
  - protection contre les robots
concepts:
  [
    idempotence,
    rate-limiting,
    reservation-temporaire,
    verrouillage-optimiste,
    anti-robots,
  ]
---

```mermaid
sequenceDiagram
  participant U as Utilisateur
  participant A as Application
  participant B as Base
  U->>A: choisit un créneau
  A->>B: réserve si libre (expire dans 10 min)
  B-->>A: réservé
  A-->>U: à confirmer avant l'expiration
  U->>A: confirme (clé d'idempotence)
  A->>B: confirme la réservation
  Note over B: sans confirmation, le créneau est libéré
```

## Quand

Deux personnes ne doivent jamais obtenir la même place, et la demande dépasse l'offre.

## Points d'attention

- **Réservation temporaire** : la ressource est bloquée quelques minutes, puis libérée
  automatiquement (expiration en base ou dans le cache).
- **Verrouillage optimiste** (numéro de version) quand les conflits sont rares ;
  **pessimiste** (`SELECT … FOR UPDATE`) quand ils sont fréquents ou coûteux.
- Une contrainte d'unicité en base reste le dernier rempart.
- Les robots raflent les places : limitation de débit et anti-robots.
