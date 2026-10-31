---
id: scalabilite
terme: "Scalabilité verticale et horizontale"
alias: ["scale up", "scale out"]
categorie: infrastructure
liens: [sans-etat, load-balancer, replicas-lecture]
niveaux:
  confirme: "Sait qu'on peut prendre une machine plus grosse ou ajouter des machines identiques."
  senior: "Rend les instances sans état pour scaler horizontalement, et suit l'ordre d'escalade du moins cher au plus cher."
  lead: "Identifie le vrai goulot (souvent la base ou un tiers) avant d'ajouter des machines."
---

- **Verticale** : une machine plus grosse. Simple, mais plafonnée, et point unique de
  défaillance.
- **Horizontale** : plus de machines identiques. Exige des serveurs **sans état**.

## Ordre d'escalade

Optimiser requêtes et index, cacher, passer en asynchrone, ajouter des réplicas,
partitionner.

## Piège

Le goulot est presque toujours la base ou un tiers, rarement le code applicatif.
