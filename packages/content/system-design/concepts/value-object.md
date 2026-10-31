---
id: value-object
terme: "Objet valeur"
alias: ["value object"]
categorie: architecture
liens: [shared-kernel]
niveaux:
  confirme: "Sait qu'un objet valeur n'a pas d'identité et se définit par sa valeur."
  senior: "Le rend immuable et valide dès sa construction (montant, adresse, numéro fiscal), et le persiste comme un type ou un objet embarqué."
  lead: "En fait la brique de base pour rendre les règles métier explicites dans le code."
---

Un objet sans identité, défini par sa valeur, **immuable** et **valide dès sa
construction** : `Montant`, `Adresse`, `Email`.

Un montant invalide ne peut pas exister : la règle est au même endroit pour tout le code.

## Piège

L'argent en flottant : toujours en entiers (centimes) dans un objet valeur.
