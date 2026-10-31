---
id: sse-websocket
terme: "SSE et WebSocket"
alias: ["Server-Sent Events", "temps réel"]
categorie: infrastructure
liens: [pub-sub]
niveaux:
  confirme: "Sait que SSE pousse des données du serveur vers le navigateur, et que WebSocket permet l'échange dans les deux sens."
  senior: "Choisit SSE quand seul le serveur pousse, WebSocket sinon, et relie les serveurs par un pub/sub."
  lead: "Ne passe au temps réel que si le besoin produit le justifie, et sait proposer un rafraîchissement périodique à la place quand il suffit."
---

- **SSE** : le serveur pousse vers le navigateur, sur une connexion HTTP simple.
- **WebSocket** : échange dans les deux sens.

Avec plusieurs serveurs, un **pub/sub** relie les connexions.

## Pièges

Reconnexion, messages manqués, nombre de connexions ouvertes.
