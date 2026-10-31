---
id: recherche-floue
terme: "Recherche floue"
alias: ["fuzzy search", "Levenshtein", "n-grammes"]
categorie: donnees
liens: [cdc]
niveaux:
  confirme: "Sait qu'une recherche peut tolérer les fautes de frappe et les mots partiels."
  senior: "Utilise distance d'édition et n-grammes (moteur de recherche dédié, ou extension de la base pour le simple), et alimente l'index depuis la source de vérité."
  lead: "Choisit entre extension de la base et moteur dédié selon le besoin réel de pertinence."
---

- **Distance d'édition** (Levenshtein) : tolère une ou deux fautes.
- **N-grammes** : retrouve les mots partiels, pour l'autocomplétion.

Pour un besoin simple, les extensions de la base relationnelle suffisent ; au-delà, un
moteur de recherche dédié, alimenté par événements ou CDC.
