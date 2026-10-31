---
id: comptabilite-partie-double
terme: "Comptabilité en partie double"
alias: ["ledger", "registre en ajout seul"]
categorie: donnees
liens: [idempotence, journal-d-audit, value-object]
niveaux:
  confirme: "Sait qu'un mouvement d'argent s'enregistre comme une écriture qui débite un compte et en crédite un autre du même montant, plutôt qu'en modifiant un solde."
  senior: "Implémente un registre en ajout seul où le solde est calculé à partir des écritures, corrige une erreur par une écriture inverse et jamais par une modification, et vérifie que la somme des écritures reste nulle."
  lead: "L'impose pour tout ce qui touche à l'argent, et organise le rapprochement régulier avec les relevés des prestataires."
---

On ne modifie jamais un solde : on **enregistre des écritures**. Chaque mouvement débite
un compte et en crédite un autre du même montant ; le solde est la somme des écritures.

## Comment

- Registre en **ajout seul** : une erreur se corrige par une écriture inverse, jamais par
  une modification.
- La somme de toutes les écritures est toujours nulle : c'est un contrôle automatique.
- Montants en **entiers** (centimes), dans un objet valeur, jamais en flottants.

## Pièges

- Stocker un solde modifiable « pour aller plus vite » : il finit par diverger.
- Oublier le rapprochement avec les relevés du prestataire de paiement.
