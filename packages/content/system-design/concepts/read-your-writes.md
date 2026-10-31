---
id: read-your-writes
terme: "Lire ses propres écritures"
alias: ["read-your-writes"]
categorie: donnees
liens: [replicas-lecture, coherence-a-terme]
niveaux:
  confirme: "Sait qu'un utilisateur doit voir tout de suite sa propre modification, même si les autres la voient plus tard."
  senior: "Lit sur la base principale juste après une écriture, ou suit la version écrite pour choisir un réplica assez à jour."
  lead: "L'identifie comme exigence produit dès qu'on introduit des réplicas ou un cache."
---

Avec des réplicas en lecture, un utilisateur peut enregistrer une modification puis… ne
pas la voir. La garantie minimale : **chacun voit ses propres écritures**.

## Comment

- Lire sur la base principale pendant quelques secondes après une écriture.
- Ou mémoriser la version écrite et lire sur un réplica qui l'a atteinte.
