---
id: bulkhead
terme: Bulkhead
alias: [cloison étanche]
categorie: resilience
liens: [circuit-breaker, timeout, rate-limiting]
niveaux:
  confirme: Sait qu'on isole des ressources (workers, connexions, files) pour qu'une panne ou une surcharge ne contamine pas tout le système.
  senior: Sépare les pools par dépendance ou par client, dimensionne chaque cloison, et l'applique aux files (traitements de masse séparés des urgences).
  lead: Décide du découpage des cloisons selon les risques métier (gros clients, tiers fragiles), et en assume le coût en ressources réservées.
---

Le terme vient de la construction navale : des cloisons étanches empêchent une voie
d'eau de couler tout le navire. En logiciel, on **isole des ressources** pour qu'un
problème reste local.

## Exemples

- Un pool de connexions par service tiers : si l'un est lent, il n'épuise que son pool.
- Des workers et une file séparés pour les traitements de masse, pour qu'un import
  nocturne ne retarde pas une demande urgente.
- Une file par client pour les webhooks sortants : un client en panne ne bloque pas les
  autres.

## Pièges

- Plus de ressources à dimensionner et à surveiller.
- Des cloisons trop fines gaspillent de la capacité inutilisée.
