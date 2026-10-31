---
id: fatigue-d-alerte
terme: "Fatigue d'alerte"
alias: ["alert fatigue"]
categorie: observabilite
liens: [burn-rate]
niveaux:
  confirme: "Sait que trop d'alertes finissent par être ignorées."
  senior: "Ne garde que des alertes actionnables, sur les symptômes vus par l'utilisateur, avec un niveau de gravité et une procédure."
  lead: "Instaure une revue régulière des alertes et supprime celles qui n'ont mené à aucune action."
---

Deux cents alertes par semaine, toutes ignorées : la vraie panne passera inaperçue.

## Remède

- Alerter sur les **symptômes** (erreurs, latence vues par l'utilisateur), pas sur chaque
  CPU.
- Chaque alerte est **actionnable** et a sa procédure.
- Revue régulière : une alerte qui n'a mené à rien est supprimée.
