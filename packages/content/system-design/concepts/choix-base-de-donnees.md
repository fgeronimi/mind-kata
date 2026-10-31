---
id: choix-base-de-donnees
terme: "Choix de base de données"
alias: ["SQL ou NoSQL"]
categorie: donnees
liens: [coherence-a-terme]
niveaux:
  confirme: "Connaît les familles (relationnelle, clé-valeur, documents, recherche, colonnes, séries temporelles) et part du relationnel par défaut."
  senior: "Choisit selon les accès (comment on lit et écrit) et justifie chaque base ajoutée, avec sa source de vérité."
  lead: "Limite le nombre de technologies de stockage opérées par l'équipe, et chiffre le coût d'exploitation de chaque ajout."
---

- **Relationnelle** : transactions, jointures, contraintes. Le défaut.
- **Clé-valeur** : cache, sessions, compteurs, files simples.
- **Documents** : schéma variable, objets lus d'un bloc.
- **Moteur de recherche** : texte, filtres, géographie ; jamais source de vérité.
- **Colonnes, entrepôt** : analytique sur de gros volumes.
- **Séries temporelles** : métriques, événements horodatés.

Choisir selon les **accès**, pas selon la mode.
