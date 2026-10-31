---
id: inbox
terme: "Inbox"
alias: ["idempotent receiver", "boîte de réception"]
categorie: messagerie
liens: [outbox, idempotence, webhook]
niveaux:
  confirme: "Sait que l'inbox stocke chaque message entrant avec son identifiant pour ignorer ceux qui arrivent en double."
  senior: "L'implémente (table avec contrainte d'unicité sur l'identifiant, enregistrement et traitement dans la même transaction) pour les webhooks et les consommateurs."
  lead: "L'impose pour toute réception au moins une fois, et en fixe la durée de rétention."
---

Pendant de l'outbox pour les messages **entrants** : chaque message reçu est enregistré
avec son identifiant. S'il revient, il est reconnu et ignoré.

## Usages

- Webhooks d'un prestataire, qui réessaie tant qu'il n'a pas reçu de réponse.
- Consommateurs d'un bus qui livre « au moins une fois ».

## Pièges

- L'enregistrement dans l'inbox et l'effet métier doivent être dans la même transaction.
- Purger les anciennes entrées, au-delà de la fenêtre de réémission de l'émetteur.
