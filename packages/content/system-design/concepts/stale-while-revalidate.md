---
id: stale-while-revalidate
terme: "Stale-while-revalidate"
alias: ["servir le périmé en revalidant"]
categorie: cache
liens: [cdn, cache-stampede]
niveaux:
  confirme: "Sait qu'on peut servir l'ancienne version d'une ressource pendant qu'on prépare la nouvelle."
  senior: "Le configure dans les en-têtes HTTP et au niveau du CDN ou de l'application, avec une durée maximale de péremption tolérée."
  lead: "L'utilise comme levier de disponibilité, en fixant avec le produit la péremption acceptable."
---

Quand une ressource expire, on sert **immédiatement l'ancienne version** et on la
recalcule en arrière-plan. L'utilisateur n'attend jamais le recalcul.

`Cache-Control: max-age=60, stale-while-revalidate=300`

C'est aussi le principe de la régénération statique incrémentale des pages.
