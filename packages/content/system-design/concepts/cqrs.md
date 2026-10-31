---
id: cqrs
terme: "CQRS"
alias: ["Command Query Responsibility Segregation"]
categorie: architecture
liens: [event-sourcing, coherence-a-terme, cdc]
niveaux:
  confirme: "Sait que CQRS sépare le modèle d'écriture du modèle de lecture."
  senior: "L'applique quand lecture et écriture divergent (projections, index, pages précalculées), en gérant la cohérence à terme."
  lead: "Le refuse sur un CRUD simple, et le réserve aux domaines où le gain est démontré."
---

Un modèle pour **écrire** (règles métier, cohérence), un autre pour **lire** (projections
optimisées pour l'affichage).

Exemple : écriture dans une base relationnelle, lecture depuis un index de recherche ou
des pages précalculées.

## Piège

Inutile sur un CRUD simple ; la cohérence à terme entre les deux modèles se gère.
