---
id: timeout
terme: Timeout
alias: [délai maximal]
categorie: resilience
liens: [circuit-breaker, retry-backoff, bulkhead]
niveaux:
  confirme: Sait qu'un appel à un service externe doit avoir un délai maximal, et que c'est le premier réflexe face à un service lent.
  senior: "Fixe des timeouts courts, distingue connexion et lecture, propage une échéance à toute la chaîne d'appels plutôt que d'empiler des délais fixes (avec des retries, les temps se multiplient), et les combine avec retries et disjoncteur."
  lead: Impose un timeout explicite sur tout appel réseau, et fait des budgets de latence un élément du contrat entre équipes.
---

Sans délai maximal, un service lent retient les threads, les connexions et les workers
de son appelant, jusqu'à le faire tomber à son tour. Le timeout **borne l'attente**.

## Comment

- Un timeout sur **chaque** appel réseau : base, cache, API tierce, service interne.
- Distinguer le délai de **connexion** (court) et le délai de **lecture** (selon
  l'opération).
- Cohérence de bout en bout : le timeout de l'appelant doit dépasser celui de ses propres
  appels, sinon il abandonne une réponse qui allait arriver.

## Pièges

- Les valeurs par défaut des bibliothèques sont souvent infinies ou de plusieurs minutes.
- Un timeout sans retry ni disjoncteur transforme une lenteur en erreur, rien de plus.
- Réessayer une opération qui a expiré suppose qu'elle soit idempotente : elle a peut-être
  abouti.
