---
id: cdc
terme: CDC
alias: [Change Data Capture, capture des changements]
categorie: donnees
liens: [outbox]
niveaux:
  confirme: Sait que le CDC lit le journal de la base de données pour diffuser chaque changement au fil de l'eau, sans modifier l'application.
  senior: Le met en place (Debezium sur le WAL PostgreSQL ou le binlog MySQL, vers un bus), sait l'utiliser pour publier une outbox, et gère l'évolution du schéma.
  lead: Arbitre entre CDC et polling d'outbox selon le volume et la latence, et distingue le CDC pour les événements métier de la réplication vers un entrepôt analytique.
---

Chaque base relationnelle tient un journal de ses écritures (le **WAL** pour
PostgreSQL, le **binlog** pour MySQL), qui sert à la réplication. Le CDC **lit ce journal**
et publie chaque insertion, modification ou suppression.

## Usages

- **Publier une outbox** sans worker de polling : chaque ligne insérée dans la table
  outbox devient un message.
- **Alimenter un index de recherche** ou un cache à partir de la source de vérité.
- **Répliquer vers un entrepôt analytique**, pour ne jamais faire de reporting sur la base
  de production.

## Outils

- Debezium : lit le journal et publie sur Kafka ou un autre bus.
- Services managés des fournisseurs cloud, souvent orientés vers l'analytique.

## Pièges

- Diffuser les tables brutes expose le schéma interne aux consommateurs : préférer
  diffuser une outbox, dont le format est un contrat.
- Une brique de plus à opérer et à superviser.
