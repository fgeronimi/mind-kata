---
id: ordre-des-messages
terme: "Ordre des messages"
alias: ["clé de partition", "ordering key"]
categorie: messagerie
liens: [idempotence, pub-sub]
niveaux:
  confirme: "Sait que l'ordre d'arrivée des messages n'est pas garanti globalement."
  senior: "Garantit l'ordre par entité (clé de partition, numéro de version ou de séquence) et ignore un message plus ancien que l'état connu."
  lead: "Limite l'exigence d'ordre au strict nécessaire, car elle réduit le parallélisme, et ne la confond pas avec l'idempotence."
---

L'ordre est garanti **par clé**, jamais globalement : tous les événements d'une même
commande dans la même partition, mais deux commandes en parallèle.

## Comment

- Clé de partition (Kafka) ou clé d'ordre (services managés) par entité.
- Un numéro de version : un message plus ancien que l'état connu est ignoré.

## Pièges

- L'ordre n'est pas l'idempotence : la livraison reste « au moins une fois ».
- Un ordre global supprime tout parallélisme.
