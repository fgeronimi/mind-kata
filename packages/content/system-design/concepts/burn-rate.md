---
id: burn-rate
terme: "Burn rate"
alias: ["vitesse de consommation du budget d'erreur"]
categorie: observabilite
liens: [sli-slo-sla, fatigue-d-alerte]
niveaux:
  confirme: "Sait qu'on peut alerter quand le budget d'erreur se consomme trop vite."
  senior: "Configure des alertes de burn rate sur plusieurs fenêtres (rapide pour les incidents, lente pour les dérives)."
  lead: "Remplace les alertes sur seuils techniques par des alertes sur les SLO."
---

Plutôt qu'alerter sur chaque erreur, on alerte quand le budget d'erreur **se consomme
trop vite** pour tenir l'objectif du mois.

Deux fenêtres : courte pour les incidents francs, longue pour les dérives lentes.
