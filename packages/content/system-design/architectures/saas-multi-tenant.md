---
id: saas-multi-tenant
titre: SaaS multi-tenant
probleme: Une même plateforme pour de nombreux clients, petits et grands
briques:
  - identifiant client partout
  - sécurité au niveau des lignes ou schéma par client
  - base dédiée pour les très gros comptes
  - limites par offre
concepts: [rate-limiting, bulkhead]
---

```mermaid
flowchart TB
  C1["Petits clients"] & C2["Clients moyens"] --> App["Application commune"]
  C3["Très gros client"] --> App
  App -->|"identifiant client + sécurité par ligne"| BP[("Base partagée")]
  App -->|isolation contractuelle| BD[("Base dédiée")]
```

## Quand

Un produit vendu à de nombreux clients, où l'isolation, les quotas et le coût par client
comptent autant que les fonctionnalités.

## Points d'attention

- **Base partagée avec identifiant client** par défaut : la plus simple à opérer.
- **Sécurité au niveau des lignes** pour qu'une requête oubliée ne fuie jamais.
- Le **voisin bruyant** : quotas par client, files séparées pour les gros comptes.
- Une base dédiée seulement sur exigence contractuelle ou volume hors norme.
- **Configuration plutôt que développement spécifique** : chaque exception se paie à
  chaque version.
