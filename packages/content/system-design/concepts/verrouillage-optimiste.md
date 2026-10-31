---
id: verrouillage-optimiste
terme: "Verrouillage optimiste"
alias: ["optimistic locking", "numéro de version"]
categorie: donnees
liens: [verrouillage-pessimiste]
niveaux:
  confirme: "Sait qu'un numéro de version permet de refuser la seconde sauvegarde quand deux personnes modifient le même objet."
  senior: "L'implémente (colonne de version, contrôle à l'écriture, message clair à l'utilisateur) et le choisit quand les conflits sont rares."
  lead: "Choisit la stratégie de conflit selon le coût d'un conflit pour le métier."
---

Chaque objet porte un **numéro de version**. À l'enregistrement, on vérifie qu'il n'a pas
changé ; sinon, la seconde sauvegarde est refusée.

Par défaut quand les conflits sont rares.

## Piège

Prévoir ce que voit l'utilisateur dont la modification est refusée.
