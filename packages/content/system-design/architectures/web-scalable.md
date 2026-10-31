---
id: web-scalable
titre: Web classique scalable
probleme: Site ou API à fort trafic, surtout en lecture
briques:
  - CDN
  - load balancer
  - conteneurs sans état
  - cache mémoire (objets, sessions)
  - base relationnelle et réplicas en lecture
concepts: [rate-limiting, timeout, autoscaling, index, replicas-lecture, cdn]
---

```mermaid
flowchart LR
  U["Utilisateurs"] --> CDN["CDN"]
  CDN --> LB["Load balancer"]
  LB --> A1["Application"]
  LB --> A2["Application"]
  A1 & A2 --> R[("Cache mémoire")]
  A1 & A2 --> P[("Base principale")]
  A1 & A2 -. lectures .-> RR[("Réplicas")]
  P -. réplication .-> RR
```

## Quand

Beaucoup de lectures, des données qui changent peu, des pics à absorber. C'est
l'architecture de départ de la plupart des sites et des API publiques.

## Points d'attention

- Des instances **sans état** : sessions dans le cache ou dans un jeton, fichiers sur un
  stockage objet. Sinon, impossible d'en ajouter.
- L'ordre d'escalade : index et requêtes, puis cache, puis asynchrone, puis réplicas,
  puis partitionnement.
- Les réplicas ont quelques millisecondes de retard : un utilisateur doit lire ses
  propres écritures sur la base principale.
