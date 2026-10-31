---
id: decorator
terme: "Decorator"
alias: ["décorateur"]
categorie: architecture
liens: [strategies-de-cache]
niveaux:
  confirme: "Sait qu'un décorateur ajoute un comportement autour d'un service sans le modifier."
  senior: "L'utilise pour ajouter cache, journalisation ou métriques autour d'un service existant."
  lead: "L'utilise pour garder les préoccupations transverses hors du code métier."
---

Envelopper un service pour lui **ajouter** un comportement (cache, journalisation,
métriques, retries) sans toucher son code.
