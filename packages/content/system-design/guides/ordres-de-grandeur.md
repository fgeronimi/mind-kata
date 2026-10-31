---
id: ordres-de-grandeur
titre: Ordres de grandeur
resume: Les repères chiffrés pour estimer vite et justifier un choix, sans dimensionner au serveur près.
ordre: 2
---

Une journée compte environ 100 000 secondes : un million de requêtes par jour, c'est
environ 12 par seconde en moyenne. Un pic vaut couramment trois à dix fois la moyenne.
Ces chiffres sont approximatifs : ils servent à raisonner, pas à dimensionner au
serveur près.

| Repère                                      | Ordre de grandeur                             |
| ------------------------------------------- | --------------------------------------------- |
| 1 M requêtes par jour                       | ~12 req/s en moyenne                          |
| 100 M requêtes par mois                     | ~40 req/s en moyenne, 200 à 400 en pic        |
| Lecture en cache mémoire                    | < 1 ms                                        |
| Requête SQL indexée simple                  | 1 à 10 ms                                     |
| Aller-retour réseau dans un même datacenter | ~0,5 ms                                       |
| Aller-retour Paris – New York               | ~80 ms                                        |
| Appel à une API tierce                      | 100 ms à plusieurs secondes, parfois en panne |
| Une ligne métier en base                    | ~1 Ko                                         |
| Une page HTML                               | 50 à 100 Ko                                   |
| Une photo web                               | 100 à 500 Ko                                  |
| Une instance PostgreSQL bien indexée        | des milliers de req/s, des centaines de Go    |

## Disponibilité

| Objectif | Indisponibilité tolérée         |
| -------- | ------------------------------- |
| 99 %     | ~7 h par mois                   |
| 99,9 %   | ~43 min par mois, 8 h 45 par an |
| 99,99 %  | ~4 min par mois                 |

## Loi de Little

Traitements simultanés = débit × durée. 14 requêtes par seconde qui prennent chacune
20 secondes, ce sont environ 280 traitements en cours en permanence.

## Règle pratique

Jusqu'à quelques centaines de requêtes par seconde, une base relationnelle unique avec
un cache tient très bien. Les architectures distribuées se justifient au-delà, ou pour
des raisons d'organisation des équipes.
