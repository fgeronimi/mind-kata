---
id: index
terme: "Index"
alias: ["index B-tree", "index composite", "plan d'exécution"]
categorie: donnees
liens: [n-plus-un, replicas-lecture, expand-and-contract]
niveaux:
  confirme: "Sait qu'un index accélère la recherche dans une table, au prix d'écritures un peu plus lentes et d'espace disque."
  senior: "Lit un plan d'exécution, choisit le bon type d'index (B-tree, composite dans le bon ordre de colonnes, partiel, spatial, plein texte) et crée les index en production sans bloquer la table."
  lead: "En fait la première étape de l'escalade avant tout cache ou réplica, et organise la revue régulière des requêtes lentes."
---

Un index évite de parcourir toute la table pour trouver une ligne. C'est **la première
étape** de toute optimisation, avant le cache ou les réplicas.

## Les types utiles

- **B-tree** : le défaut, pour l'égalité, les plages et le tri.
- **Composite** : plusieurs colonnes, dans l'ordre des filtres les plus sélectifs.
- **Partiel** : seulement les lignes utiles (les dossiers « en cours »).
- **Spatial**, **plein texte** : pour la géographie et la recherche de mots.

## Pièges

- Ajouter un index sans lire le plan d'exécution.
- Créer un index en production en bloquant la table : le créer en ligne.
- Trop d'index ralentissent les écritures.
