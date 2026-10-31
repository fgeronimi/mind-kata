---
id: mtls-zero-trust
terme: "mTLS et Zero Trust"
alias: ["TLS mutuel", "confiance zéro"]
categorie: securite
liens: [chiffrement]
niveaux:
  confirme: "Sait que dans une approche Zero Trust aucun appel n'est fiable par défaut, même interne."
  senior: "Fait s'authentifier les services entre eux (TLS mutuel, jetons de service) et donne l'accès aux outils internes par identité plutôt que par réseau."
  lead: "Remplace la confiance accordée au réseau interne par des identités vérifiées, de façon progressive."
---

**Zero Trust** : être dans le réseau interne ne donne aucun droit. Chaque appel prouve
son identité.

- **mTLS** : les deux services présentent un certificat.
- Accès aux outils internes par identité (proxy d'identité) plutôt que par VPN.
