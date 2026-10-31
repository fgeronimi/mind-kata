---
id: identite-numerique-publique
terme: "Identité numérique publique"
alias: ["FranceConnect", "ProConnect"]
categorie: secteur-public
liens: [sso, rate-limiting]
niveaux:
  confirme: "Sait que les services publics proposent la connexion avec une identité numérique déjà vérifiée (FranceConnect pour les usagers, ProConnect pour les agents et professionnels)."
  senior: "L'intègre en OpenID Connect, gère le niveau de garantie demandé et prévoit un parcours de repli pour les usagers qui n'en disposent pas."
  lead: "L'utilise pour réduire la fraude et le coût de la vérification d'identité, sans exclure les publics éloignés du numérique."
---

Plutôt que de créer un compte de plus, l'usager se connecte avec une identité déjà
vérifiée par ailleurs : **FranceConnect** pour les particuliers, **ProConnect** pour les
agents et les professionnels.

Techniquement, c'est de l'**OpenID Connect**, avec des niveaux de garantie selon la
sensibilité de la démarche.

## Piège

Prévoir un parcours pour ceux qui n'ont pas d'identité numérique : un service public ne
peut exclure personne.
