---
id: verrouillage-pessimiste
terme: "Verrouillage pessimiste"
alias: ["SELECT FOR UPDATE"]
categorie: donnees
liens: [verrouillage-optimiste]
niveaux:
  confirme: "Sait qu'on peut bloquer une ligne pendant qu'on la modifie pour empêcher toute modification concurrente."
  senior: "L'utilise (SELECT … FOR UPDATE) quand les conflits sont fréquents ou coûteux, en gardant les transactions courtes."
  lead: "Le réserve aux cas qui l'exigent, car il limite la concurrence et expose aux interblocages."
---

On **bloque la ligne** le temps de la modification (`SELECT … FOR UPDATE`).

Pour les conflits fréquents ou coûteux : un paiement, un stock très disputé.

## Pièges

- Transactions longues, attentes, interblocages.
- Ne jamais garder un verrou pendant une interaction utilisateur.
