---
id: paiement
titre: Paiement
probleme: Encaisser de l'argent de façon fiable, sans double débit ni perte
briques:
  - clé d'idempotence par paiement
  - registre en partie double
  - machine à états
  - webhooks et inbox
  - rapprochement quotidien
concepts: [idempotence, saga, webhook, circuit-breaker, timeout, retry-backoff]
---

```mermaid
stateDiagram-v2
  [*] --> Cree
  Cree --> Autorise: autorisation
  Autorise --> Capture: capture
  Capture --> Rembourse: remboursement
  Cree --> Echoue: refus
  Autorise --> Echoue: expiration
  Capture --> [*]
  Rembourse --> [*]
  Echoue --> [*]
```

## Quand

Tout flux d'argent : une erreur se paie en litiges, en remboursements et en confiance.

## Points d'attention

- **Clé d'idempotence** sur chaque paiement : un double clic ou un retry ne débite
  jamais deux fois.
- **Registre en partie double**, en ajout seul ; le solde est une projection des
  écritures. Montants en entiers (centimes), jamais en flottants.
- **Machine à états** explicite : créé, autorisé, capturé, remboursé, échoué.
- C'est le **webhook du prestataire** qui fait foi, pas le retour du navigateur ; les
  webhooks passent par une inbox pour ignorer les doublons.
- Prestataires derrière un adaptateur ; timeout, retries, disjoncteur.
- Commande, paiement et stock en **saga**, avec remboursement en compensation.
- **Rapprochement** quotidien avec le relevé du prestataire. Tokenisation des cartes.
