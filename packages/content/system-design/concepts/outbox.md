---
id: outbox
terme: Outbox
alias: [transactional outbox, boîte d'envoi]
categorie: messagerie
liens: [idempotence, cdc, saga]
niveaux:
  confirme: Sait que l'outbox évite de perdre un événement quand l'application plante entre l'écriture en base et la publication sur le bus.
  senior: L'implémente (table outbox écrite dans la même transaction, worker qui publie et marque comme publié) et sait que les consommateurs doivent alors être idempotents.
  lead: Choisit entre polling et CDC selon le volume et la latence, et en fait le mode de publication standard des événements de l'équipe.
---

Écrire en base puis publier sur un bus, ce sont deux opérations : si l'application
plante entre les deux, l'événement est perdu. L'outbox les ramène à **une seule
transaction**.

## Comment

1. Dans la même transaction que la donnée métier, on insère l'événement dans une table
   `outbox`.
2. Un processus séparé lit la table, publie sur le bus, puis marque l'événement comme
   publié.

La publication se fait par :

- **Polling** : un worker lit la table environ chaque seconde
  (`SELECT … FOR UPDATE SKIP LOCKED` pour en faire tourner plusieurs). Simple, suffisant
  la plupart du temps.
- **CDC** : un outil lit le journal de la base et publie chaque insertion. Plus de
  débit, moins de latence, une brique de plus.

## Pièges

- La publication peut avoir lieu deux fois (plantage après publication, avant le
  marquage) : les consommateurs doivent être **idempotents**.
- L'outbox n'est native dans aucun framework courant : elle se code ou s'appuie sur un
  transport en base.
- Penser à purger la table.
