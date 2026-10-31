---
id: circuit-breaker
terme: Circuit breaker
alias: [disjoncteur]
categorie: resilience
liens: [timeout, retry-backoff, bulkhead]
niveaux:
  confirme: Sait qu'après une série d'échecs on cesse d'appeler un service en panne, et qu'on sert un mode dégradé à la place.
  senior: Le configure (seuil d'échecs, durée d'ouverture, état semi-ouvert pour tester le retour), le combine avec un timeout et des retries, et définit le mode dégradé avec le produit.
  lead: Décide quelles dépendances méritent un disjoncteur et quel mode dégradé est acceptable pour le métier, et fait superviser l'état des circuits.
---

Quand un service tiers est en panne, continuer à l'appeler gaspille des ressources,
rallonge les temps de réponse et l'empêche de se rétablir. Le disjoncteur **coupe les
appels** après une série d'échecs.

## Les trois états

- **Fermé** : les appels passent, les échecs sont comptés.
- **Ouvert** : au-delà du seuil, les appels échouent immédiatement, sans toucher le
  service ; on sert un mode dégradé (valeur en cache, fonction désactivée, file
  d'attente).
- **Semi-ouvert** : après un délai, quelques appels d'essai ; s'ils réussissent, le
  circuit se referme.

## Pièges

- Sans **timeout** court en amont, un service lent ne déclenche jamais le disjoncteur :
  le timeout est le premier réflexe, le disjoncteur le second.
- Des seuils mal réglés font clignoter le circuit.
- Le mode dégradé se décide avec le produit, pas seulement dans le code.
