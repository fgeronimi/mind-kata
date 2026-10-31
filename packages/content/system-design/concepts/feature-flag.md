---
id: feature-flag
terme: "Feature flag"
alias: ["drapeau de fonctionnalité"]
categorie: deploiement
liens: [canary]
niveaux:
  confirme: "Sait qu'un feature flag active ou coupe une fonctionnalité sans redéployer."
  senior: "L'utilise pour activer client par client, couper vite en cas de problème, et séparer déploiement et mise en service."
  lead: "Organise le nettoyage des flags, car leur accumulation devient une dette."
---

Déployer le code n'est plus le mettre en service : on **active** une fonctionnalité pour
deux clients pilotes, puis pour tous, et on la **coupe** en un clic si elle pose problème.

## Piège

Retirer les flags une fois la fonctionnalité généralisée.
