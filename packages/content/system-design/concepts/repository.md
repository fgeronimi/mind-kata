---
id: repository
terme: "Repository"
alias: ["dépôt"]
categorie: architecture
liens: [architecture-hexagonale]
niveaux:
  confirme: "Sait qu'un repository cache l'accès aux données derrière une interface."
  senior: "Le définit dans le domaine et l'implémente dans l'infrastructure, avec des méthodes qui parlent métier."
  lead: "Fixe la convention de l'équipe sur ce qui passe par le repository et ce qui passe par des requêtes de lecture dédiées."
---

Une interface qui parle métier (`dossiersEnAttente()`) et cache l'accès aux données.

## Piège

Les lectures complexes, d'affichage, gagnent souvent à passer par des requêtes dédiées.
