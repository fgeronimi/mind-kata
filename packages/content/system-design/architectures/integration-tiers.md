---
id: integration-tiers
titre: Intégration et synchronisation avec des tiers
probleme: Appels à des services tiers sous quota, parfois lents ou en panne
briques:
  - un adaptateur par partenaire
  - files par priorité
  - limitation du débit sortant
  - disjoncteur
  - coalescence et réconciliation
concepts:
  [circuit-breaker, timeout, retry-backoff, rate-limiting, bulkhead, webhook]
---

```mermaid
flowchart LR
  App["Application"] -->|"événement de changement"| FU[["File urgente"]]
  App --> FM[["File de masse"]]
  FU & FM --> W["Workers"]
  W --> A1["Adaptateur partenaire A"] --> T1(("Tiers A"))
  W --> A2["Adaptateur partenaire B"] --> T2(("Tiers B"))
  T1 & T2 -. webhooks .-> In["Réception + inbox"]
  R["Réconciliation périodique"] --> T1 & T2
```

## Quand

On pousse des données vers des partenaires (ou on en reçoit) qui imposent des quotas et
ne sont pas toujours disponibles.

## Points d'attention

- Un **adaptateur par tiers** derrière une interface commune : une panne chez l'un ne
  bloque pas les autres.
- **Timeout court**, retries avec backoff et jitter, **disjoncteur**.
- **Débit sortant maîtrisé** pour respecter les quotas.
- **Coalescence** : d'une rafale de modifications, n'envoyer que la dernière version.
- Une urgence unitaire ne doit pas attendre derrière une opération de masse : files
  séparées, quota réservé.
- **Réconciliation** périodique : les écarts arrivent toujours, il faut les détecter et
  suivre leur taux.
