---
id: idempotence
terme: Idempotence
alias: [clé d'idempotence, idempotency key]
categorie: messagerie
liens: [outbox, retry-backoff, webhook, saga]
niveaux:
  confirme: Sait qu'exécuter deux fois une opération idempotente donne le même résultat qu'une fois, et cite la clé d'idempotence face à un double envoi.
  senior: L'implémente (clé fournie par le client, table avec contrainte d'unicité, réponse rejouée) et sait où elle est indispensable — paiements, consommateurs de messages, webhooks reçus.
  lead: En fait une règle d'architecture pour tout ce qui est réessayé ou livré « au moins une fois », et arbitre son coût (stockage, durée de rétention des clés).
---

Une opération idempotente produit le même résultat, qu'on l'exécute une fois ou
plusieurs. C'est la condition pour pouvoir **réessayer sans risque** : après une coupure
réseau, le client ne sait pas si sa requête est passée, il la renvoie.

## Comment

- **Clé d'idempotence** : le client génère un identifiant unique par opération et
  l'envoie dans un en-tête (`Idempotency-Key`). Le serveur stocke la clé et la réponse ;
  une seconde requête avec la même clé reçoit la même réponse, sans nouvel effet.
- **Contrainte d'unicité** en base sur la clé : c'est elle qui tranche quand deux
  requêtes identiques arrivent en même temps.
- **Côté consommateur de messages** : garder l'identifiant des messages déjà traités, ou
  un numéro de version, et ignorer ce qui a déjà été vu.
- Envoyer l'**état complet** plutôt qu'un delta : appliquer deux fois « stock = 12 » est
  sans danger, appliquer deux fois « stock − 1 » ne l'est pas.

## Pièges

- À prévoir dès le départ : difficile à ajouter quand les doublons sont déjà en base.
- Un triple clic sur « Valider » est un cas d'idempotence, pas seulement un souci d'interface.
- L'idempotence n'est pas l'ordre : un message idempotent peut toujours arriver dans le
  désordre.
