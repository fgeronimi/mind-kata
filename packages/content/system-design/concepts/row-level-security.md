---
id: row-level-security
terme: "Sécurité au niveau des lignes"
alias: ["Row Level Security", "RLS"]
categorie: securite
liens: [chiffrement]
niveaux:
  confirme: "Sait que la base peut filtrer automatiquement les lignes visibles selon le client ou l'utilisateur."
  senior: "L'active pour un système multi-tenant, avec l'identifiant client fixé par session, en complément des contrôles applicatifs."
  lead: "L'impose comme filet de sécurité dès qu'une fuite entre clients serait grave."
---

La base filtre elle-même les lignes selon le client courant : une requête qui oublie son
filtre ne fuit pas pour autant.

## Piège

Un filet de sécurité, pas un remplacement des contrôles de droits dans l'application.
