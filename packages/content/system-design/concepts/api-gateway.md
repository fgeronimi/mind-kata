---
id: api-gateway
terme: "API Gateway"
alias: ["passerelle d'API"]
categorie: architecture
liens: [rate-limiting, bff]
niveaux:
  confirme: "Sait qu'une passerelle d'API est le point d'entrée unique des API."
  senior: "Y place l'authentification, les quotas, le routage et la journalisation, sans logique métier."
  lead: "Garde la passerelle mince, et la fait opérer comme un composant critique."
---

Point d'entrée unique : authentification, limitation de débit, routage, journalisation.

## Piège

N'y mettre **aucune logique métier** : elle deviendrait le goulot de toutes les équipes.
