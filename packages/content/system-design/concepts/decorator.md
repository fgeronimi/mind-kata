---
id: decorator
terme: "Decorator"
alias: ["décorateur"]
categorie: architecture
liens: [strategies-de-cache]
niveaux:
  confirme: "Sait qu'un décorateur ajoute un comportement autour d'un service sans le modifier."
  senior: "L'utilise pour ajouter cache, journalisation ou métriques autour d'un service existant."
  lead: "En fait la convention de l'équipe pour les préoccupations transverses (cache, journalisation, métriques), afin qu'elles restent hors du code métier et activables par configuration."
---

Envelopper un service pour lui **ajouter** un comportement (cache, journalisation,
métriques, retries) sans toucher son code.
