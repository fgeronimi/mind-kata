---
id: expand-and-contract
terme: "Expand and contract"
alias: ["migration sans coupure", "parallel change"]
categorie: donnees
liens: []
niveaux:
  confirme: "Sait qu'on modifie un schéma sans coupure en ajoutant d'abord, puis en retirant l'ancien plus tard."
  senior: "Déroule les étapes (nouvelle colonne, double écriture, rattrapage par lots, bascule de la lecture, suppression) et crée les index sans bloquer."
  lead: "En fait la règle pour toute migration en production, compatible avec la version précédente du code déployé."
---

Renommer une colonne de 200 millions de lignes sans coupure :

1. **Élargir** : ajouter la nouvelle colonne.
2. Écrire dans les deux.
3. Rattraper l'existant **par lots**.
4. Basculer la lecture.
5. **Réduire** : supprimer l'ancienne colonne.

Chaque étape est compatible avec la version précédente du code.

## Piège

Un index créé sans précaution verrouille la table : le créer en ligne.
