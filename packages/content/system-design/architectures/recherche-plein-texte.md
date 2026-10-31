---
id: recherche-plein-texte
titre: Recherche plein texte
probleme: Rechercher par mots, avec fautes, filtres et géographie
briques:
  - index inversé (moteur de recherche)
  - alimentation par événements ou CDC
  - source de vérité en base
concepts: [cdc, outbox]
---

```mermaid
flowchart LR
  App["Application"] -->|écrit| B[("Base : source de vérité")]
  B -->|"CDC ou événements"| I["Indexation"]
  I --> M[("Moteur de recherche")]
  U["Utilisateur"] -->|recherche| App
  App -->|requête| M
```

## Quand

La recherche dépasse le `LIKE` : pertinence, tolérance aux fautes, autocomplétion,
filtres combinés, distance.

## Points d'attention

- Le moteur de recherche n'est **jamais la source de vérité** : il se reconstruit depuis
  la base.
- Alimentation par événements ou CDC ; un léger retard est normal, à annoncer.
- Recherche floue (distance de Levenshtein, n-grammes) ; pour un besoin simple, les
  extensions de la base relationnelle suffisent.
- Prévoir la réindexation complète sans coupure.
