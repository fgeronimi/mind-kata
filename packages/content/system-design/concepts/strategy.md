---
id: strategy
terme: "Strategy"
alias: ["stratégie"]
categorie: architecture
liens: [adapter]
niveaux:
  confirme: "Sait que le pattern Strategy choisit un comportement à l'exécution parmi plusieurs implémentations."
  senior: "L'utilise pour un choix par client ou par configuration (fournisseur de paiement, de carte), sans conditions dispersées."
  lead: "L'utilise pour rendre un comportement configurable plutôt que développé au cas par cas."
---

Plusieurs implémentations d'une même interface, choisies **à l'exécution** : le
fournisseur de paiement selon le pays, le moteur de carte selon le client.

Remplace une cascade de `if` dispersés dans le code.
