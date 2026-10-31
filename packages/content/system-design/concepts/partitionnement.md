---
id: partitionnement
terme: "Partitionnement et sharding"
alias: ["partitioning", "sharding"]
categorie: donnees
liens: [replicas-lecture]
niveaux:
  confirme: "Sait que partitionner découpe une table dans une base, et que sharder répartit les données sur plusieurs bases."
  senior: "Partitionne par date pour les gros volumes historiques, choisit la clé de sharding selon les accès, et connaît le coût des requêtes transverses."
  lead: "Partitionne avant de sharder, et ne sharde que sur une mesure qui l'impose, tant le coût d'exploitation est élevé."
---

- **Partitionnement** : une table découpée en morceaux dans la même base (par date,
  souvent). Archivage et purge faciles.
- **Sharding** : les données réparties sur plusieurs bases selon une clé.

« Je partitionne avant de sharder. »

## Pièges

- Une mauvaise clé de sharding crée des points chauds.
- Les requêtes qui traversent les shards deviennent coûteuses.
