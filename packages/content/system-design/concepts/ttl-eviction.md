---
id: ttl-eviction
terme: "Durée de vie et éviction"
alias: ["TTL", "LRU", "LFU"]
categorie: cache
liens: [strategies-de-cache]
niveaux:
  confirme: "Sait qu'une entrée de cache a une durée de vie, et qu'un cache plein évince les entrées les moins utiles."
  senior: "Choisit la durée de vie selon la fraîcheur exigée et la politique d'éviction (moins récemment ou moins fréquemment utilisée) selon les accès."
  lead: "Dimensionne la mémoire du cache à partir du taux de succès mesuré."
---

- **TTL** : durée de vie d'une entrée.
- **Éviction** quand le cache est plein : **LRU** (la moins récemment utilisée) ou
  **LFU** (la moins fréquemment utilisée).

## Piège

Une durée de vie trop longue sert du faux ; trop courte, le cache ne sert à rien.
