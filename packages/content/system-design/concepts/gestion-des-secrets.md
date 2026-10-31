---
id: gestion-des-secrets
terme: "Gestion des secrets"
alias: ["Secret Manager", "Vault", "rotation"]
categorie: securite
liens: [chiffrement]
niveaux:
  confirme: "Sait qu'aucun secret ne doit être en clair dans le code ou dans Git."
  senior: "Range les secrets dans un gestionnaire dédié, les injecte à l'exécution, les fait tourner, et scanne les dépôts en CI."
  lead: "Prévoit la procédure en cas de fuite : rotation immédiate, analyse des accès, post-mortem."
---

Les secrets vivent dans un **gestionnaire dédié** et sont injectés à l'exécution.

## Un secret a fuité dans Git

1. **Rotation immédiate** : le secret est compromis, le supprimer de l'historique ne
   suffit pas.
2. Vérifier les journaux d'accès.
3. Ajouter un scan de secrets en CI.
