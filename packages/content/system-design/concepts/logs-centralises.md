---
id: logs-centralises
terme: "Logs structurés et centralisés"
alias: ["trois piliers", "journalisation"]
categorie: observabilite
liens: [tracing-distribue]
niveaux:
  confirme: "Sait que les journaux de tous les serveurs doivent être rassemblés au même endroit."
  senior: "Produit des logs structurés (JSON) avec un identifiant de corrélation, centralisés et reliés aux traces et aux métriques."
  lead: "Fixe ce qui se journalise, combien de temps, et sans données personnelles."
---

Avec dix instances, chercher dans les logs de chaque serveur est impossible : on les
**centralise**, en format **structuré**, avec un identifiant de corrélation.

Les trois piliers : **logs**, **métriques**, **traces**.

## Piège

Ne jamais journaliser de données personnelles ou de secrets.
