---
id: event-sourcing
terme: "Event sourcing"
alias: ["sourçage d'événements"]
categorie: architecture
liens: [cqrs]
niveaux:
  confirme: "Sait que l'event sourcing stocke la suite des événements plutôt que l'état courant, et reconstruit l'état en les rejouant."
  senior: "L'associe à des projections pour la lecture, gère la version des événements et les instantanés."
  lead: "Ne le propose que si l'historique est un vrai besoin métier (audit, comptabilité), jamais par défaut."
---

On ne stocke pas l'état, mais **tout ce qui s'est passé**. L'état courant est obtenu en
rejouant les événements.

Utile quand l'historique est le métier : audit, comptabilité, reconstitution du passé.

## Pièges

- Complexe : versions d'événements, instantanés, projections.
- Proposer l'event sourcing avant la solution simple est un signal d'alerte en entretien.
