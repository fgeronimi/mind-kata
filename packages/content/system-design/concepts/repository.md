---
id: repository
terme: "Repository"
alias: ["dépôt"]
categorie: architecture
liens: [architecture-hexagonale]
niveaux:
  confirme: "Sait qu'un repository cache l'accès aux données derrière une interface."
  senior: "Le définit dans le domaine et l'implémente dans l'infrastructure, avec des méthodes qui parlent métier."
  lead: "S'assure que les requêtes complexes de lecture ne passent pas toutes par lui."
---

Une interface qui parle métier (`dossiersEnAttente()`) et cache l'accès aux données.

## Piège

Les lectures complexes, d'affichage, gagnent souvent à passer par des requêtes dédiées.
