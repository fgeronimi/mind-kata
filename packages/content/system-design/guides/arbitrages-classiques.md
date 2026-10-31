---
id: arbitrages-classiques
titre: Arbitrages classiques
resume: Partir du choix le plus simple et dire à partir de quel seuil on changerait. C'est ce qui montre la maturité.
ordre: 4
---

Partir du choix le plus simple et dire à partir de quel seuil on changerait. C'est ce
qui montre la maturité.

| Arbitrage                               | Défaut                                                                                                   | On bascule quand…                                                                                         |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Monolithe modulaire / microservices     | Monolithe modulaire, bien découpé en domaines                                                            | Plusieurs équipes se bloquent sur le même déploiement, ou une partie a un profil de charge très différent |
| SQL / NoSQL                             | SQL                                                                                                      | Schéma très variable, volume d'écriture énorme, ou besoin clé-valeur pur                                  |
| Synchrone / asynchrone                  | Synchrone pour ce que l'utilisateur attend                                                               | Traitement long, appel tiers, diffusion vers plusieurs systèmes                                           |
| Précalcul / rendu à la demande          | Précalcul pour ce qui est très lu et peu modifié                                                         | Trop de variantes à précalculer, ou fraîcheur immédiate exigée                                            |
| Cohérence forte / à terme               | Forte pour l'argent et les droits, à terme ailleurs                                                      | Le produit accepte un délai explicite                                                                     |
| Construire / acheter                    | Acheter ce qui est critique mais pas différenciant (CDN, certificats, authentification, envoi d'e-mails) | C'est le cœur de la valeur, ou le coût à l'usage explose                                                  |
| Une base partagée / une base par client | Base partagée avec identifiant client                                                                    | Exigence contractuelle d'isolation, ou un client écrase les autres                                        |
| Big bang / migration progressive        | Toujours progressive                                                                                     | Jamais vraiment                                                                                           |

## Formulation type

> Je pars sur X parce que c'est le plus simple qui tient la charge annoncée. Le signal
> qui me ferait changer, c'est Y, et à ce moment-là je passerais à Z.
