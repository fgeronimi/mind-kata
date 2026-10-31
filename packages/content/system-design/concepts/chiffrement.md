---
id: chiffrement
terme: "Chiffrement au repos et en transit"
alias: ["TLS", "HSTS", "KMS", "CMEK"]
categorie: securite
liens: [crypto-shredding, gestion-des-secrets]
niveaux:
  confirme: "Sait qu'on chiffre les données stockées (au repos) et celles qui circulent (en transit)."
  senior: "Chiffre en transit avec TLS et HSTS, au repos par le stockage ou par colonne pour les données sensibles, avec des clés dans un service de gestion de clés."
  lead: "Décide des clés gérées par le client (CMEK) quand le contrat ou la réglementation l'exigent."
---

- **En transit** : TLS partout, HSTS pour interdire le retour au HTTP.
- **Au repos** : chiffrement du stockage, et **par colonne** pour les données les plus
  sensibles.
- Les clés vivent dans un **service de gestion de clés**, jamais à côté des données.

## Piège

Des données chiffrées dont la clé est dans le même dépôt ne sont pas protégées.
