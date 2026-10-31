---
id: tests-de-charge
terme: "Tests de charge"
alias: ["k6", "Gatling", "JMeter"]
categorie: tests
liens: [load-shedding]
niveaux:
  confirme: "Sait qu'on vérifie qu'un système tient la charge attendue avant une période à risque."
  senior: "Rejoue deux fois le pic attendu dans un environnement proche de la production, mesure les percentiles et simule les tiers."
  lead: "Planifie les tests de charge avant chaque échéance et en tire la capacité réelle."
---

Rejouer **deux fois le pic attendu**, avant l'échéance, dans un environnement proche de la
production.

- Mesurer les 95e et 99e percentiles, pas la moyenne.
- Simuler les tiers, et prévenir l'hébergeur.
