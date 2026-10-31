---
id: spof
terme: "Point unique de défaillance"
alias: ["SPOF", "single point of failure"]
categorie: infrastructure
liens: [load-balancer, rto-rpo]
niveaux:
  confirme: "Sait qu'un composant dont la panne arrête tout est un point unique de défaillance."
  senior: "Les élimine par la redondance multi-zones, les health checks et une base hautement disponible."
  lead: "Les recherche aussi dans l'organisation (une seule personne qui sait) et chez les fournisseurs."
---

Un seul serveur, une seule base, un seul load balancer : s'il tombe, tout tombe.

## Parades

Plusieurs instances sur plusieurs zones, health checks, base hautement disponible,
sauvegardes testées.

## Piège

Le point unique est parfois une personne, ou un fournisseur.
