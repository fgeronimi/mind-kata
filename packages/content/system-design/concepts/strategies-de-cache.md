---
id: strategies-de-cache
terme: "Stratégies de cache"
alias: ["cache-aside", "write-through", "write-behind"]
categorie: cache
liens: [cache-stampede, ttl-eviction, stale-while-revalidate]
niveaux:
  confirme: "Connaît le cache-aside (lire le cache, sinon la base, puis remplir le cache) et sait qu'il faut une stratégie d'invalidation."
  senior: "Choisit entre cache-aside, write-through et write-behind selon le besoin de fraîcheur et le risque de perte, et invalide par événement ou par tag."
  lead: "Fait chiffrer la fraîcheur attendue avant tout cache, et suit le taux de succès du cache comme un indicateur."
---

- **Cache-aside** (le plus courant) : lire le cache ; sinon lire la base et remplir le cache.
- **Write-through** : écrire dans le cache et dans la base en même temps. Toujours frais,
  écritures plus lentes.
- **Write-behind** : écrire dans le cache, la base suit plus tard. Rapide, mais risque de
  perte.

## Pièges

- Parler de cache sans chiffrer la fraîcheur attendue.
- L'invalidation : par durée de vie, par événement, par tag.
- Le cache froid après un redémarrage.
