---
id: filtre-de-bloom
terme: "Filtre de Bloom"
alias: ["Bloom filter"]
categorie: donnees
liens: []
niveaux:
  confirme: "Sait qu'un filtre de Bloom répond « sûrement pas » ou « peut-être » à la question « cet élément existe-t-il ? »."
  senior: "L'utilise pour éviter des lectures inutiles (code déjà pris, clé absente), en gardant la vérification exacte derrière."
  lead: "Le propose quand le volume le justifie, en chiffrant le taux de faux positifs acceptable."
---

Une structure probabiliste, très économe en mémoire : jamais de faux négatif, quelques
faux positifs.

Exemple : vérifier qu'un code court n'est pas déjà pris avant d'interroger la base.

## Piège

Ce n'est pas une garantie : la contrainte d'unicité en base reste indispensable.
