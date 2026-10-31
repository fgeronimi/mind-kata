---
id: polling-push
terme: "Polling ou push"
alias: ["interrogation", "notification"]
categorie: messagerie
liens: [webhook, pub-sub]
niveaux:
  confirme: "Sait que le polling interroge régulièrement alors que le push prévient quand quelque chose change."
  senior: "Choisit selon la fraîcheur et le volume, et combine souvent les deux (notification puis réconciliation périodique)."
  lead: "Impose une réconciliation même quand tout passe par push, car des notifications se perdent toujours."
---

- **Polling** : le client redemande régulièrement. Simple, mais coûteux et en retard.
- **Push** : le système prévient (webhook, événement, SSE). Frais et économe, mais une
  notification peut se perdre.

## Réponse attendue

Push pour la fraîcheur, plus un **polling de réconciliation** à basse fréquence pour
rattraper ce qui a été manqué.
