---
id: pub-sub
terme: "Pub/sub"
alias: ["publication-abonnement", "bus d'événements"]
categorie: messagerie
liens: [outbox, fan-out, ordre-des-messages]
niveaux:
  confirme: "Sait que l'émetteur publie un message sans connaître ses destinataires, et que chaque abonné le reçoit."
  senior: "Choisit l'outil (RabbitMQ pour distribuer, Kafka pour rejouer et les gros volumes), gère l'ordre, les doublons et la publication fiable."
  lead: "Décide quels échanges passent par événements plutôt que par appels directs, et fait des formats d'événements des contrats versionnés."
---

L'émetteur publie un événement ; les abonnés le reçoivent, chacun de son côté. Ajouter un
abonné ne demande aucune modification de l'émetteur.

## RabbitMQ ou Kafka

- **RabbitMQ** : une file par abonné, le message disparaît une fois acquitté. Pour
  distribuer des tâches et relier des modules.
- **Kafka** : un journal conservé et relisible, ordonné par partition. Pour rejouer
  l'historique, les très gros volumes, de nombreux consommateurs.

## Pièges

- L'observabilité : qui consomme quoi, avec quel retard ?
- Le format de l'événement est un contrat : le faire évoluer sans casser les abonnés.
