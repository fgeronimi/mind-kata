---
id: sso
terme: "Authentification unique"
alias: ["SSO", "SAML", "OpenID Connect", "OIDC", "OAuth2"]
categorie: securite
liens: [scim]
niveaux:
  confirme: "Sait que l'utilisateur peut se connecter avec le compte de son entreprise ou d'un fournisseur d'identité."
  senior: "Intègre OpenID Connect ou SAML, mappe les rôles depuis les groupes du fournisseur et gère les sessions et leur révocation."
  lead: "Délègue l'authentification à un fournisseur plutôt que de la construire, et couvre le cycle de vie complet des comptes."
---

- **OpenID Connect** (sur OAuth2) et **SAML** : se connecter avec un compte existant.
- Les rôles viennent des groupes du fournisseur d'identité.

## Piège

Quand un salarié part, ses sessions doivent être révoquées : c'est le rôle de SCIM.
