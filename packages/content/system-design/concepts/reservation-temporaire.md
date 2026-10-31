---
id: reservation-temporaire
terme: "Réservation temporaire"
alias: ["blocage avec expiration"]
categorie: donnees
liens: [verrouillage-optimiste, idempotence, anti-robots]
niveaux:
  confirme: "Sait qu'on peut bloquer une ressource rare (créneau, place, article) pendant quelques minutes, et la libérer automatiquement si l'utilisateur ne confirme pas."
  senior: "L'implémente avec une expiration (clé de cache à durée de vie ou colonne de date d'expiration avec nettoyage), protège la confirmation contre les accès concurrents et la rend idempotente."
  lead: "Fixe avec le métier la durée de blocage acceptable, et anticipe les abus (robots qui bloquent toutes les ressources) avant chaque ouverture."
---

L'utilisateur choisit un créneau : on le **bloque quelques minutes** le temps qu'il
confirme. Sans confirmation, il est libéré automatiquement.

## Comment

- Une clé de cache avec durée de vie, ou une colonne `expire_le` et un nettoyage
  périodique.
- La confirmation est protégée contre les accès concurrents et **idempotente**.

## Pièges

- Des robots qui bloquent toutes les ressources sans jamais confirmer.
- Une durée trop courte frustre, trop longue immobilise l'offre.
