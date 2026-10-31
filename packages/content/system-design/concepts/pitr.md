---
id: pitr
terme: "Restauration à un instant précis"
alias: ["PITR", "point-in-time recovery"]
categorie: donnees
liens: [rto-rpo]
niveaux:
  confirme: "Sait qu'on peut restaurer une base à une minute précise grâce à ses journaux."
  senior: "L'active (sauvegarde de base et journaux archivés) et sait l'utiliser après une erreur humaine."
  lead: "Fait tester la restauration régulièrement et l'aligne sur le RPO exigé."
---

Une sauvegarde complète, plus l'archivage continu des journaux d'écriture : on peut
**rejouer jusqu'à une minute précise**, juste avant une suppression accidentelle.

## Piège

Tester la restauration, et mesurer combien de temps elle prend.
