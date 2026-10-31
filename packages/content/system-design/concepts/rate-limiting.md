---
id: rate-limiting
terme: Rate limiting
alias: [limitation de débit, throttling, token bucket]
categorie: resilience
liens: [bulkhead, retry-backoff]
niveaux:
  confirme: Sait qu'on limite le nombre de requêtes par client pour protéger la plateforme, et qu'on répond 429 au-delà.
  senior: Choisit l'algorithme (token bucket, fenêtre glissante), place la limite au bon endroit (passerelle, CDN, application), partage le compteur entre instances et renvoie un Retry-After.
  lead: Définit des quotas par offre ou par client, maîtrise aussi le débit sortant vers les tiers sous quota, et fait de la limitation un outil contre les abus et les dérives de coût.
---

Un client qui envoie mille requêtes par seconde ralentit tous les autres. La limitation
de débit **plafonne ce que chacun peut consommer**.

## Comment

- **Token bucket** : chaque client a un seau qui se remplit à débit constant ; une
  requête consomme un jeton ; seau vide, requête refusée. Tolère les rafales courtes.
- Réponse **429 Too Many Requests** avec un en-tête `Retry-After`.
- Placement : dans la passerelle d'API ou le CDN pour décharger l'application ; dans
  l'application pour des règles fines (par utilisateur, par action).
- Avec plusieurs instances, le compteur doit être partagé (Redis).

## Dans les deux sens

- **Entrant** : protéger sa plateforme.
- **Sortant** : respecter les quotas d'un tiers, en lissant ses propres appels.

## Pièges

- Une limite par adresse IP pénalise les utilisateurs derrière un même proxy.
- Une réponse 429 sans `Retry-After` pousse les clients à réessayer aussitôt.
