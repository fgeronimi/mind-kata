---
id: dlq
terme: "File des messages en échec"
alias: ["DLQ", "dead letter queue", "failure transport"]
categorie: messagerie
liens: [retry-backoff, idempotence]
niveaux:
  confirme: "Sait qu'un message qui échoue de façon répétée est mis de côté dans une file dédiée au lieu de bloquer les autres."
  senior: "Configure le nombre de tentatives avant la DLQ, alerte sur sa taille, et outille le rejeu manuel après correction."
  lead: "Fait de la DLQ un indicateur suivi en exploitation, avec un responsable et une procédure, et distingue pannes passagères et vraies erreurs."
---

Un message qui échoue après plusieurs tentatives est déplacé dans une **file d'échecs**,
pour ne pas bloquer ceux qui suivent ni être perdu.

## Comment

- Un nombre limité de tentatives, avec backoff, avant le passage en DLQ.
- Une alerte sur la taille de la DLQ : un message qui y entre est un incident.
- Un rejeu manuel, une fois la cause corrigée — donc un traitement idempotent.

## Pièges

- Une DLQ que personne ne regarde est une poubelle.
- Une panne passagère d'un tiers ne doit pas remplir la DLQ : on la gère par disjoncteur et
  remise en file différée.
