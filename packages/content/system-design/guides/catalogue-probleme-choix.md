---
id: catalogue-probleme-choix
titre: Catalogue problème → choix
resume: Pour chaque problématique courante, le choix par défaut, la raison à donner et le piège que l'examinateur attend.
ordre: 3
---

Chaque ligne relie une problématique à un choix par défaut, la raison à donner, et le
piège à anticiper.

| Problématique                                  | Choix par défaut                                                              | Pourquoi                                                    | Piège à anticiper                                                                  |
| ---------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Beaucoup de lectures, données qui changent peu | Cache à plusieurs niveaux : CDN pour les pages, cache mémoire pour les objets | Décharge la base, latence faible, coût bas                  | Invalidation par événement ou par tag ; stale-while-revalidate pendant le recalcul |
| Pics de charge prévisibles                     | Autoscaling, préchauffage du cache, tests de charge avant le pic              | On dimensionne pour le pic, pas la moyenne                  | Le maillon qui ne scale pas (base, API tierce) ; prévoir un mode dégradé           |
| Traitement long ou lourd                       | Asynchrone : file de messages et workers                                      | L'utilisateur n'attend pas, la charge est lissée            | Idempotence, retries avec backoff, file d'échecs, suivi du statut                  |
| Appels à des API tierces                       | Un connecteur isolé par tiers, appels asynchrones                             | Une panne chez un tiers ne bloque pas le reste              | Quotas, circuit breaker, timeouts, réconciliation                                  |
| Diffuser un changement vers N systèmes         | Événement publié sur un bus, chaque consommateur s'abonne                     | Découplage, un consommateur s'ajoute sans toucher la source | Ordre des messages, doublons, outbox pour ne rien perdre                           |
| Urgences et traitements de masse mélangés      | Plusieurs files par priorité                                                  | Une opération de masse ne retarde pas une urgence           | Surveiller la profondeur de chaque file                                            |
| Cohérence entre plusieurs services             | Cohérence à terme par événements                                              | Évite les transactions distribuées                          | Dire au produit ce qui peut être incohérent, et combien de temps                   |
| Recherche texte ou géographique                | Moteur de recherche dédié ; extension géographique de la base pour le simple  | Index adaptés, filtres combinés                             | Index à resynchroniser depuis la source de vérité                                  |
| Base relationnelle qui sature                  | Index et requêtes d'abord, puis réplicas en lecture, puis partitionnement     | Du moins cher au plus cher                                  | Ne pas sharder par réflexe ; les réplicas sont en retard                           |
| Plusieurs clients sur la même plateforme       | Multi-tenant avec identifiant client partout ; base dédiée pour les très gros | Simple à opérer                                             | Le voisin bruyant : quotas par client, isolation des gros comptes                  |
| Fichiers, images, vidéos                       | Stockage objet, CDN, URL signées                                              | Pas de fichiers en base ni sur les serveurs                 | Purge des données personnelles, coûts de sortie réseau                             |
| Temps réel (notifications, messagerie)         | WebSocket ou SSE, pub/sub entre serveurs                                      | Pousser plutôt que sonder                                   | Reconnexion, messages manqués, nombre de connexions ouvertes                       |
| Pages qui doivent être référencées             | Rendu serveur ou génération statique, servi par CDN                           | Les moteurs indexent mal le JavaScript                      | Sitemap, données structurées, URL canoniques, redirections 301                     |
| Haute disponibilité                            | Redondance sur plusieurs zones, health checks, sauvegardes testées            | Pas de point unique de défaillance                          | Définir RTO et RPO ; tester la restauration, pas seulement la sauvegarde           |
| Données personnelles                           | Minimisation, pseudonymisation, chiffrement, purge automatique                | Obligation légale et confiance                              | Droit à l'oubli dans les sauvegardes et les index                                  |
| Authentification et droits                     | OAuth2 / OIDC, rôles par client                                               | Standard, délégable à un fournisseur                        | Droits au niveau de l'objet, pas seulement de l'écran                              |
| Savoir ce qui se passe en production           | Logs structurés, métriques, traces, SLO et alertes                            | Détecter avant que l'utilisateur appelle                    | Alerter sur les symptômes, pas sur chaque CPU                                      |
| Coût qui dérive                                | Mesurer le coût par unité (par client, par page, par appel)                   | Rend l'arbitrage chiffrable                                 | API payantes à l'usage, sortie réseau                                              |
