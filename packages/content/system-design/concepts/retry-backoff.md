---
id: retry-backoff
terme: Retry avec backoff
alias: [retry, backoff exponentiel, jitter]
categorie: resilience
liens: [idempotence, timeout, circuit-breaker, dlq]
niveaux:
  confirme: Sait qu'on réessaie une erreur passagère avec un délai qui augmente (1 s, 2 s, 4 s), et pas en boucle immédiate.
  senior: "Ajoute du jitter, limite le nombre de tentatives, ne réessaie que les erreurs transitoires (pas un 400), respecte le Retry-After renvoyé avec un 429 ou un 503, et vérifie que l'opération réessayée est idempotente."
  lead: Harmonise la politique de retry entre services pour éviter l'effet d'amplification, et la relie aux budgets d'erreur et aux files d'échecs.
---

Beaucoup d'erreurs sont passagères : coupure réseau, service redémarré, quota
momentanément dépassé. Réessayer est raisonnable, à condition de **laisser au service
le temps de se remettre**.

## Comment

- **Backoff exponentiel** : attendre 1 s, puis 2 s, puis 4 s…
- **Jitter** : ajouter un délai aléatoire, pour que tous les clients ne réessaient pas à
  la même seconde.
- **Limite** : un nombre maximal de tentatives, puis l'échec est assumé (file d'échecs,
  alerte, message à l'utilisateur).
- Ne réessayer que ce qui peut réussir la fois suivante : un 503 ou un délai dépassé, pas
  une requête invalide.

## Pièges

- Sans jitter, les retries synchronisés frappent le service au moment où il redémarre.
- Sans limite, les retries **aggravent la panne** qu'ils voulaient contourner.
- Réessayer une opération non idempotente crée des doublons.
- Des retries empilés à chaque couche (client, passerelle, service) se multiplient.
