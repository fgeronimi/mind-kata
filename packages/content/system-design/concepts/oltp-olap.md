---
id: oltp-olap
terme: "OLTP et OLAP"
alias: ["transactionnel", "analytique"]
categorie: donnees
liens: [cdc]
niveaux:
  confirme: "Sait que la base transactionnelle et la base d'analyse ont des besoins différents."
  senior: "Alimente un entrepôt analytique séparé (CDC ou extractions) et n'exécute jamais de reporting lourd sur la production."
  lead: "Organise le flux de données vers l'analytique comme un produit, avec ses délais et sa gouvernance."
---

- **OLTP** : beaucoup de petites transactions, faible latence.
- **OLAP** : peu de requêtes, mais qui balaient des millions de lignes.

Deux bases distinctes ; l'entrepôt est alimenté par CDC ou par lots.

## Piège

Le reporting sur la base de production finit toujours par la ralentir.
