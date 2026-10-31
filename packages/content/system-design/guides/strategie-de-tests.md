---
id: strategie-de-tests
titre: Stratégie de tests
resume: Relier chaque type de test à un risque précis du projet, de la règle métier jusqu'à la production.
ordre: 6
---

En system design, les tests prouvent que l'architecture tient ses promesses : la logique
est juste, les intégrations ne cassent pas, la charge passe, et une erreur en production
se voit et se corrige vite. Toujours relier un type de test à un risque précis.

## La pyramide

| Niveau       | Ce qu'on vérifie                                    | Outils                                    | Volume                                                          |
| ------------ | --------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------- |
| Unitaires    | Règles métier, sans base ni réseau                  | PHPUnit, Pest, Vitest, Jest, pytest       | Beaucoup, en millisecondes                                      |
| Intégration  | Un module avec sa vraie base, son cache, son broker | Testcontainers, bases éphémères en CI     | Moyen                                                           |
| Contrat      | Une API ne casse pas ses consommateurs              | Pact, validation contre le schéma OpenAPI | Un par interface entre équipes                                  |
| Bout en bout | Les parcours critiques dans un vrai navigateur      | Playwright, Cypress                       | Peu : les parcours qui rapportent ou coûtent cher s'ils cassent |

Beaucoup de tests rapides en bas, peu de tests lents en haut. Une pyramide inversée donne
une CI lente et des tests instables.

## Les tests propres aux sujets d'architecture

- **Charge** : k6, Gatling, Locust, JMeter. Rejouer deux fois le pic attendu avant chaque
  période à risque. Mesurer les 95e et 99e percentiles de latence, pas la moyenne.
- **Asynchrone** : le même message traité deux fois ne produit pas de doublon ; les
  retries et la file d'échecs fonctionnent.
- **Intégrations tierces** : simuler le tiers (WireMock, mocks HTTP), y compris ses pannes,
  ses lenteurs et ses quotas dépassés.
- **Résilience** : couper un composant volontairement pour vérifier le mode dégradé et les
  alertes.
- **Front** : régression visuelle, Lighthouse CI pour la performance et le référencement.
- **Sécurité** : analyse statique et des dépendances en CI, scan dynamique (OWASP ZAP),
  tests d'intrusion avant une mise en production sensible.
- **Qualité des tests eux-mêmes** : tests de mutation (Infection, Stryker). La couverture
  est un indicateur, pas un objectif.

## Tester en production, sans risque

- Feature flags pour activer une fonctionnalité client par client.
- Déploiement canary : une petite part du trafic sur la nouvelle version, comparaison des
  erreurs et de la latence, puis élargissement.
- Smoke tests juste après chaque déploiement, retour arrière en un clic.
- Monitoring synthétique : un robot joue un parcours critique chaque minute.

## Dans la CI

- Analyse statique, unitaires, intégration, contrat, build, préproduction, bout en bout,
  smoke tests.
- Rester sous 10 à 15 minutes : parallélisation, tests lents la nuit.
- Un test instable est corrigé ou mis en quarantaine tout de suite, sinon l'équipe cesse
  de croire la CI.
- Jamais de données de production non anonymisées.

## Côté organisation

- Les tests font partie de la définition de « terminé ».
- Ce sont les développeurs qui écrivent les tests ; un profil QA aide à définir la
  stratégie, il ne rattrape pas les tests manquants.
- Sur une refonte : tests de caractérisation sur l'ancien système d'abord.

## Formulation type

> Je relie chaque type de test à un risque : la logique métier en unitaire, les
> intégrations en contrat, la charge avant chaque pic, et en production des feature
> flags, du canary et du monitoring synthétique pour détecter avant l'utilisateur.
