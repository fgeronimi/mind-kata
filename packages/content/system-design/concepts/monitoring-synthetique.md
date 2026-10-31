---
id: monitoring-synthetique
terme: "Monitoring synthétique"
alias: ["sonde", "smoke test"]
categorie: observabilite
liens: [sli-slo-sla]
niveaux:
  confirme: "Sait qu'un robot peut jouer un parcours critique en continu pour détecter une panne."
  senior: "Fait tourner les parcours critiques chaque minute depuis l'extérieur, et des tests de fumée après chaque déploiement."
  lead: "Choisit les parcours sondés selon ce qui rapporte ou coûte le plus s'il casse."
---

Un robot joue un **parcours critique** (connexion, paiement) chaque minute, depuis
l'extérieur. Il détecte la panne avant l'utilisateur.

Après chaque déploiement, des tests de fumée vérifient l'essentiel.
