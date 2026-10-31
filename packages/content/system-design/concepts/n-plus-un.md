---
id: n-plus-un
terme: "Problème N+1"
alias: ["N+1"]
categorie: cache
liens: []
niveaux:
  confirme: "Sait qu'afficher une liste en faisant une requête par élément multiplie les requêtes."
  senior: "Le détecte (profilage, compteur de requêtes en test) et le corrige par jointure ou chargement anticipé."
  lead: "Ajoute une vérification automatique du nombre de requêtes sur les pages critiques."
---

Cinquante dossiers affichés, cinquante et une requêtes : une pour la liste, une par
dossier pour ses données liées.

## Correction

Jointure ou **chargement anticipé** (eager loading), dans tous les ORM.

## Piège

Invisible en développement avec dix lignes, catastrophique en production avec dix mille.
