---
id: bff
terme: "Backend for Frontend"
alias: ["BFF"]
categorie: architecture
liens: [api-gateway]
niveaux:
  confirme: "Sait qu'un BFF est une API dédiée à un client (web, mobile) qui agrège plusieurs services."
  senior: "Le met en place quand un écran appelle de nombreux services, avec des appels en parallèle côté serveur."
  lead: "En limite le nombre et le confie à l'équipe du client concerné."
---

Une application mobile qui appelle six services pour un écran : un BFF **agrège côté
serveur**, en parallèle, et renvoie exactement ce dont l'écran a besoin.

## Piège

Un BFF par client, pas un par écran : sinon, duplication.
