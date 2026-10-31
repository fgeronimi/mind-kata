---
id: cap
terme: "Théorème CAP"
alias: ["CAP", "Brewer"]
categorie: donnees
liens: [coherence-a-terme]
niveaux:
  confirme: "Sait qu'en cas de coupure réseau, un système distribué doit choisir entre cohérence et disponibilité."
  senior: "Situe les bases utilisées sur ce choix et explique le comportement attendu pendant une partition."
  lead: "Traduit ce choix en comportement visible par l'utilisateur et le fait valider par le métier ; sait aussi que, même sans coupure, on arbitre entre latence et cohérence (PACELC)."
---

Cohérence, disponibilité, tolérance au partitionnement : en cas de **coupure réseau**
entre deux nœuds, il faut choisir de rester cohérent (refuser des requêtes) ou disponible
(accepter des divergences).

## Piège

Hors coupure, le vrai arbitrage quotidien est entre cohérence et latence.
