---
id: hmac
terme: "Signature HMAC"
alias: ["HMAC"]
categorie: securite
liens: [webhook]
niveaux:
  confirme: "Sait qu'une signature HMAC prouve qu'un message vient bien de celui qui partage le secret."
  senior: "Signe les webhooks émis et vérifie ceux reçus (comparaison en temps constant, horodatage contre le rejeu)."
  lead: "En fait le standard de toutes les intégrations entrantes et sortantes, avec rotation des secrets."
---

L'émetteur calcule une signature du message avec un secret partagé ; le destinataire la
recalcule et compare. Un message modifié ou forgé est rejeté.

## Pièges

- Comparer en temps constant.
- Inclure un horodatage pour refuser le rejeu d'un ancien message.
