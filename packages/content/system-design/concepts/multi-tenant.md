---
id: multi-tenant
terme: "Multi-tenant"
alias: ["multi-locataire", "voisin bruyant"]
categorie: architecture
liens: [row-level-security, rate-limiting, bulkhead]
niveaux:
  confirme: "Sait que plusieurs clients peuvent partager la même plateforme, et que leurs données ne doivent jamais se mélanger."
  senior: "Choisit le modèle d'isolation (identifiant client partout avec filtrage au niveau des lignes, schéma par client, base dédiée) et protège la plateforme du voisin bruyant par des quotas."
  lead: "Arbitre le modèle selon les exigences contractuelles et le coût d'exploitation, et isole les très gros clients seulement quand la mesure le justifie."
---

Une seule plateforme, de nombreux clients. Trois modèles d'isolation, du plus simple au
plus cloisonné :

1. **Base partagée**, identifiant client sur chaque ligne, filtrage au niveau des lignes.
2. **Schéma par client**.
3. **Base dédiée**, pour les exigences contractuelles ou les volumes hors norme.

## Le voisin bruyant

Un client qui consomme tout ralentit les autres : quotas par client, files séparées pour
les gros comptes.
