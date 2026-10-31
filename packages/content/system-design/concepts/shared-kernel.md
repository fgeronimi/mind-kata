---
id: shared-kernel
terme: "Noyau partagé"
alias: ["shared kernel"]
categorie: architecture
liens: [value-object]
niveaux:
  confirme: "Sait qu'un noyau partagé regroupe les quelques classes communes à plusieurs modules."
  senior: "Le garde petit et stable (identifiants, horloge, objets valeur), sans entité métier partagée."
  lead: "Contrôle ce qui y entre, car tout changement touche tous les modules."
---

Ce que plusieurs modules partagent vraiment : identifiants, horloge, quelques objets
valeur, l'interface du bus.

## Piège

Ne jamais y mettre d'entité métier : entre modules, seul l'identifiant circule.
