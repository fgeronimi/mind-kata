---
id: replicas-lecture
terme: "Réplicas en lecture"
alias: ["read replicas"]
categorie: donnees
liens: [read-your-writes, partitionnement]
niveaux:
  confirme: "Sait qu'on ajoute des copies de la base pour répartir les lectures."
  senior: "Les met en place après les index et le cache, route les lectures tolérantes au retard, et surveille le retard de réplication."
  lead: "Les situe dans l'ordre d'escalade, du moins cher au plus cher, et ne les propose que quand la mesure le justifie."
---

Des copies de la base, alimentées en continu, reçoivent les lectures ; la base principale
garde les écritures.

## Ordre d'escalade

Index et requêtes, puis cache, puis réplicas, puis partitionnement, puis sharding.

## Piège

Les réplicas ont du **retard** (quelques millisecondes à quelques secondes) : garantir que
chacun lit ses propres écritures.
