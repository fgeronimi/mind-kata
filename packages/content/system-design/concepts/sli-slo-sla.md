---
id: sli-slo-sla
terme: "SLI, SLO et SLA"
alias: ["budget d'erreur"]
categorie: observabilite
liens: [burn-rate]
niveaux:
  confirme: "Sait qu'on mesure un indicateur (SLI), qu'on vise un objectif (SLO) et qu'on signe un accord (SLA)."
  senior: "Définit des SLO sur ce que vit l'utilisateur et en tire un budget d'erreur ; connaît les ordres de grandeur (99,9 % ≈ 43 min par mois)."
  lead: "Utilise le budget d'erreur pour arbitrer entre nouvelles fonctionnalités et fiabilité."
---

- **SLI** : l'indicateur mesuré (part des requêtes réussies en moins de 300 ms).
- **SLO** : l'objectif interne (99,9 % sur 30 jours).
- **SLA** : l'engagement contractuel, plus prudent que le SLO.

Le **budget d'erreur** est ce qui reste : 99,9 % autorise environ 43 minutes
d'indisponibilité par mois.
