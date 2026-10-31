---
id: cdn
terme: "CDN"
alias: ["Content Delivery Network", "réseau de diffusion"]
categorie: cache
liens: [stale-while-revalidate, strategies-de-cache]
niveaux:
  confirme: "Sait qu'un CDN garde des copies du contenu près des utilisateurs pour réduire la latence et décharger le serveur d'origine."
  senior: "Met en cache les pages et les réponses d'API publiques via les en-têtes, purge par URL ou par tag, et protège l'origine."
  lead: "L'utilise aussi comme couche de sécurité (protection contre le déni de service, pare-feu applicatif) et suit le coût de la bande passante."
---

Des serveurs de cache en périphérie, près des utilisateurs : latence faible, charge retirée
de l'origine.

## Leviers

- En-têtes `Cache-Control`, stale-while-revalidate.
- **Purge** par URL ou par tag.
- Protection contre le déni de service, pare-feu applicatif.

Pas seulement pour le statique : des pages HTML entières et des réponses d'API publiques.
