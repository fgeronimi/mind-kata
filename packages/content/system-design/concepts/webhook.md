---
id: webhook
terme: Webhook
alias: [rappel HTTP]
categorie: messagerie
liens: [idempotence, inbox, retry-backoff, bulkhead, circuit-breaker, dlq]
niveaux:
  confirme: Sait qu'un webhook est un appel HTTP qu'un système envoie à une URL pour prévenir d'un événement, plutôt que d'être interrogé.
  senior: Côté réception, vérifie la signature, stocke l'événement avec son identifiant pour ignorer les doublons et répond vite ; côté émission, envoie depuis une file avec retry, backoff et file d'échecs.
  lead: Conçoit l'offre de webhooks d'une plateforme (une file par client, signature HMAC, rejeu manuel, tableau de bord des livraisons) et ne s'appuie jamais sur le seul retour du navigateur pour un événement critique.
---

Plutôt que d'interroger un système toutes les minutes (polling), on lui donne une URL :
il **nous appelle** quand un événement se produit.

## Recevoir

- **Vérifier la signature** (HMAC avec un secret partagé) : n'importe qui peut appeler
  l'URL.
- **Stocker puis répondre** : enregistrer l'événement avec son identifiant (inbox), répondre
  200 tout de suite, traiter en asynchrone.
- **Ignorer les doublons** : l'émetteur réessaie, le même événement arrivera plusieurs fois.

## Émettre

- Envoyer depuis une file, jamais dans la requête de l'utilisateur.
- Retry avec backoff et jitter, file d'échecs, rejeu manuel.
- Une file par client destinataire, pour qu'un client en panne ne retarde pas les autres.
- Un identifiant d'événement et une signature dans chaque envoi.

## Pièges

- L'ordre d'arrivée n'est pas garanti.
- Pour un paiement, ne jamais se fier au seul retour du navigateur : c'est le webhook du
  prestataire qui fait foi.
