---
id: pipeline-batch
titre: Pipeline batch
probleme: Gros fichiers à traiter ou calcul réglementaire sur un grand volume
briques:
  - découpage en lots
  - workers parallèles
  - règles versionnées par date
  - double run
concepts: [idempotence, bulkhead, retry-backoff]
---

```mermaid
flowchart LR
  E["Fichier ou extraction"] --> D["Découpage en lots"]
  D --> F[["File de lots"]]
  F --> W1["Worker"] & W2["Worker"] & W3["Worker"]
  W1 & W2 & W3 --> R[("Résultats")]
  R --> C["Contrôle et rapprochement"]
```

## Quand

Un volume trop gros pour une requête (import nocturne, calcul mensuel, génération de
milliers de documents), avec des règles qui changent dans le temps.

## Points d'attention

- **Import différentiel** d'abord : ne traiter que ce qui a changé.
- Lots **idempotents** et reprenables : un lot en échec se rejoue sans doublon.
- Une file et des workers **séparés** des traitements interactifs.
- **Règles versionnées par date** : on recalcule le passé avec les règles du passé.
- **Double run** lors d'un changement de moteur : comparer avant de basculer.
- Mémoire : traiter en flux, par paquets, sans tout charger.
