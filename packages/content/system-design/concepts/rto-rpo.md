---
id: rto-rpo
terme: "RTO et RPO"
alias: ["Recovery Time Objective", "Recovery Point Objective"]
categorie: resilience
liens: [pitr]
niveaux:
  confirme: "Sait que le RTO est le temps de reprise acceptable et le RPO la perte de données acceptable après un incident."
  senior: "Fait chiffrer RTO et RPO par le métier, et en déduit sauvegardes, réplication et procédure de reprise ; teste la restauration."
  lead: "Arbitre le coût de chaque minute de RTO et de RPO avec le métier, et fait des exercices de reprise une routine d'équipe."
---

Deux questions à poser dès le cadrage : **combien de temps** peut-on être en panne (RTO,
_Recovery Time Objective_), et **combien de données** peut-on perdre (RPO, _Recovery
Point Objective_) ?

Un RPO de 24 heures se contente d'une sauvegarde quotidienne ; un RPO de quelques secondes
exige de la réplication et la restauration à un instant précis.

## Pièges

- Une sauvegarde qui n'a jamais été restaurée n'est pas une sauvegarde.
- Viser zéro partout coûte très cher : le chiffrer avec le métier.
