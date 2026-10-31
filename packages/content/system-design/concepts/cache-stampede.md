---
id: cache-stampede
terme: "Ruée sur le cache"
alias: ["cache stampede", "thundering herd"]
categorie: cache
liens: [strategies-de-cache, stale-while-revalidate, ttl-eviction]
niveaux:
  confirme: "Sait que quand une clé très demandée expire, de nombreuses requêtes peuvent recalculer la même valeur en même temps et frapper la base."
  senior: "S'en protège par un verrou de recalcul, le service de la valeur périmée pendant le recalcul, ou une durée de vie avec une part aléatoire."
  lead: "L'anticipe sur les pages à fort trafic et les ouvertures de service, avec préchauffage du cache."
---

Une clé très demandée expire : 5 000 requêtes la recalculent en même temps, et la base
s'écroule.

## Parades

- Un **verrou** : une seule requête recalcule, les autres attendent ou servent l'ancienne
  valeur.
- **Stale-while-revalidate** : servir la valeur périmée pendant le recalcul.
- **Durée de vie aléatoire** : les clés n'expirent pas toutes à la même seconde.
- Recalcul anticipé avant l'expiration.
