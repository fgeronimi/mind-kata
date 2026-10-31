---
id: adapter
terme: "Adapter"
alias: ["adaptateur"]
categorie: architecture
liens: [anti-corruption-layer, strategy]
niveaux:
  confirme: "Sait qu'un adaptateur fait correspondre une interface externe à l'interface attendue par le code."
  senior: "Place chaque plateforme externe derrière une interface commune, un adaptateur par plateforme."
  lead: "Fait de ce découpage la base d'un système de connecteurs extensible."
---

Un adaptateur par plateforme externe, derrière une **interface commune** : le reste du
code ne sait pas à quel partenaire il parle.

C'est le cœur d'un système de connecteurs.
