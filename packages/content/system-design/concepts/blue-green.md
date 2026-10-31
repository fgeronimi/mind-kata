---
id: blue-green
terme: "Blue/green"
alias: ["déploiement bleu/vert"]
categorie: deploiement
liens: [canary, expand-and-contract]
niveaux:
  confirme: "Sait qu'on prépare la nouvelle version dans un second environnement, puis qu'on bascule le trafic."
  senior: "Bascule le trafic d'un coup avec retour arrière instantané, en gardant la base compatible avec les deux versions."
  lead: "Choisit entre blue/green et canary selon le risque et le coût de l'environnement en double."
---

Deux environnements : l'un sert le trafic, l'autre reçoit la nouvelle version. On
**bascule**, et le retour arrière est instantané.

## Piège

La base est partagée : les migrations doivent être compatibles avec les deux versions.
