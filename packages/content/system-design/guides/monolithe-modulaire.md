---
id: monolithe-modulaire
titre: Monolithe, microservices, monolithe modulaire
resume: Le défaut à défendre est le monolithe modulaire. Comment le construire, et quels signaux justifient d'extraire un service.
ordre: 5
---

Le défaut à défendre est le **monolithe modulaire** : un seul déploiement, découpé en
modules par domaine métier, avec des frontières vérifiées automatiquement. On extrait un
service seulement sur un signal concret.

|                       | Monolithe                          | Monolithe modulaire                              | Microservices                                        |
| --------------------- | ---------------------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| Déploiement           | Un artefact                        | Un artefact                                      | Un par service                                       |
| Base de données       | Partagée, tout le monde joint tout | Partagée, tables possédées par un module         | Une par service                                      |
| Communication         | Appels de fonctions                | Façades publiques et événements internes         | HTTP, gRPC, broker de messages                       |
| Transactions          | Faciles                            | Faciles dans un module, événements entre modules | Cohérence à terme, sagas                             |
| Coût d'exploitation   | Faible                             | Faible                                           | Élevé (orchestration, observabilité, CI par service) |
| Autonomie des équipes | Faible quand ça grossit            | Bonne si les frontières tiennent                 | Forte                                                |
| Risque principal      | La « grosse boule de boue »        | Frontières qui s'érodent sans contrôle           | Le monolithe distribué                               |

**Signaux qui justifient d'extraire un service** : plusieurs équipes se bloquent sur les
mêmes déploiements, une partie a une charge très différente (recherche, import,
génération), un besoin d'isolation (paiement, données sensibles), ou une technologie
différente vraiment nécessaire. La loi de Conway s'applique : l'architecture finit par
refléter l'organisation des équipes.

## Construire la modularité

**1. Découper par domaine, pas par couche technique.** Un module par contexte métier (les
_bounded contexts_ du DDD), et non un dossier de contrôleurs et un dossier d'entités.
Chaque module a sa propre architecture interne en couches.

```
src/
  Catalogue/
    Domain/          entités, règles métier, événements
    Application/     cas d'usage, traitement des commandes
    Infrastructure/  ORM, clients HTTP, adaptateurs
    UI/              contrôleurs, API
    Api/             façade publique : seul point d'entrée pour les autres modules
  Commandes/
  Facturation/
  Shared/            noyau minimal : identifiants, horloge, bus
```

**2. Une API publique par module.** Les autres modules n'appellent qu'une façade exposée
(des objets en lecture seule), jamais une entité ou un repository interne. On fait
référence aux objets d'un autre module par leur identifiant, pas par une relation d'ORM.

**3. Des frontières vérifiées en CI.** Une règle qui n'est pas vérifiée finit par être
contournée : Deptrac en PHP, ArchUnit ou Spring Modulith en Java, dependency-cruiser en
TypeScript, import-linter en Python. Un fichier CODEOWNERS par dossier pour l'ownership.

**4. Chaque module possède ses données.** Tables préfixées ou, mieux, un schéma de base
par module. Aucune jointure SQL entre modules : un module qui a besoin d'une donnée d'un
autre passe par la façade, ou garde une copie mise à jour par événement.

**5. Communiquer par événements entre modules.** Quand une commande est validée, le module
Commandes publie un événement ; Facturation s'y abonne. Transport synchrone au départ,
puis asynchrone quand un traitement doit sortir de la requête. Un transport en base joue
le rôle d'une outbox : l'événement est écrit dans la même transaction que la donnée.

**6. Tester par module.** Tests unitaires sur le domaine, d'intégration sur
l'infrastructure, de contrat sur la façade publique.

**7. Préparer l'extraction sans la faire.** Le jour où un module doit devenir un service,
la façade devient un client HTTP ou gRPC, le transport devient un vrai broker, et les
données sont déjà séparées. On redirige alors le trafic progressivement (strangler fig).

## Formulation type

> Je pars sur un monolithe modulaire, découpé par domaine, avec des frontières vérifiées
> en CI et des événements entre modules. J'ai la simplicité d'un seul déploiement
> aujourd'hui, et une extraction peu coûteuse le jour où un signal concret la justifie.
