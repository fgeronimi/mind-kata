---
id: identifiants-distribues
terme: "Identifiants distribués"
alias: ["UUID v7", "ULID", "Snowflake"]
categorie: donnees
liens: []
niveaux:
  confirme: "Sait qu'on peut générer des identifiants uniques sans base centrale."
  senior: "Choisit un identifiant trié dans le temps (UUID v7, ULID) pour garder des index efficaces."
  lead: "Arbitre entre identifiant opaque et séquentiel selon l'exposition publique et la performance."
---

Générer un identifiant **sans passer par la base** : utile pour créer un objet côté
client, ou dans plusieurs services.

Préférer un identifiant **trié dans le temps** (UUID v7, ULID) : un UUID aléatoire
fragmente les index.

## Piège

Un identifiant séquentiel exposé révèle le volume d'activité.
