---
id: reporting-analytique
titre: Reporting et analytique
probleme: Tableaux de bord et analyses sur de gros volumes, sans ralentir la production
briques:
  - séparation lecture et écriture (CQRS)
  - CDC vers un entrepôt analytique
  - transformations dans l'entrepôt
concepts: [cdc]
---

```mermaid
flowchart LR
  App["Application"] --> B[("Base transactionnelle")]
  B -->|CDC| E[("Entrepôt analytique")]
  E --> T["Transformations"]
  T --> D["Tableaux de bord"]
```

## Quand

Des requêtes analytiques lourdes (agrégats sur des mois, croisements) qui ralentiraient
la base de production.

## Points d'attention

- **Jamais de reporting sur la base de production** : un entrepôt séparé, alimenté en
  continu.
- Transactionnel et analytique ont des besoins opposés : ce sont deux bases.
- Les données arrivent avec un délai : le dire aux utilisateurs des tableaux de bord.
- Les données personnelles suivent jusque dans l'entrepôt : même minimisation, même purge.
