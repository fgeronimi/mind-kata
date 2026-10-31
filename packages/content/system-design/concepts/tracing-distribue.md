---
id: tracing-distribue
terme: Tracing distribué
alias: [distributed tracing, trace]
categorie: observabilite
liens: [timeout]
niveaux:
  confirme: Sait qu'un identifiant de trace suit une requête à travers tous les services, pour retrouver où le temps est passé.
  senior: Instrumente avec OpenTelemetry, propage le contexte dans les appels HTTP et les messages, et relie traces, logs et métriques par le même identifiant.
  lead: En fait un prérequis de tout nouveau service, choisit le taux d'échantillonnage selon le coût, et l'utilise pour piloter les budgets de latence.
---

Une requête lente traverse cinq services : les logs de chacun ne disent pas lequel
ralentit. Le tracing distribué **suit la requête de bout en bout**.

## Comment

- Chaque requête reçoit un **identifiant de trace**, propagé dans les en-têtes HTTP et
  dans les métadonnées des messages.
- Chaque étape (appel, requête SQL, traitement) est une **span**, avec sa durée et son
  parent.
- On visualise la trace comme une cascade : le goulot saute aux yeux.

## Les trois piliers

**Logs**, **métriques** et **traces** répondent à des questions différentes ; les relier
par le même identifiant permet de passer de l'un à l'autre.

## Outils

OpenTelemetry pour instrumenter, puis le backend de son choix (Jaeger, les services
managés des fournisseurs cloud, les plateformes d'observabilité).

## Pièges

- Le contexte se perd dans les traitements asynchrones s'il n'est pas propagé dans les
  messages.
- Tout tracer coûte cher : on échantillonne.
