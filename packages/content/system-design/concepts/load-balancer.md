---
id: load-balancer
terme: "Load balancer"
alias: ["répartiteur de charge", "L4", "L7"]
categorie: infrastructure
liens: [scalabilite, spof]
niveaux:
  confirme: "Sait qu'un load balancer répartit le trafic entre plusieurs instances et retire celles qui ne répondent plus."
  senior: "Choisit entre couche 4 (TCP) et couche 7 (HTTP : routage, terminaison TLS), configure les health checks et évite les sessions collantes."
  lead: "Le double pour qu'il ne devienne pas lui-même un point unique de défaillance."
---

Répartit le trafic et retire les instances qui échouent aux **health checks**.

- **Couche 4** (TCP) : rapide, aveugle au contenu.
- **Couche 7** (HTTP) : routage par URL ou en-tête, terminaison TLS.

## Piège

Les sessions collantes empêchent de scaler proprement.
