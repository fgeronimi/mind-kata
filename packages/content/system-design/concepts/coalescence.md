---
id: coalescence
terme: "Coalescence"
alias: ["fusion des modifications"]
categorie: messagerie
liens: [idempotence, rate-limiting]
niveaux:
  confirme: "Sait que d'une rafale de modifications sur le même objet, on n'envoie que la dernière version."
  senior: "L'implémente (clé par objet, délai de regroupement, envoi de l'état complet) pour économiser les quotas d'un tiers."
  lead: "L'utilise pour maîtriser les coûts et les quotas des intégrations, en arbitrant le délai de fraîcheur acceptable."
---

Dix modifications d'une même fiche en une minute n'ont pas besoin de dix envois : seule la
**dernière version** compte.

## Comment

- Une clé par objet ; une nouvelle modification remplace la précédente en attente.
- Un court délai de regroupement avant l'envoi.
- On envoie l'**état complet**, pas une suite de deltas.

## Piège

Le délai de regroupement retarde la fraîcheur : le fixer avec le produit.
