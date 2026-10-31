---
id: tests-de-caracterisation
terme: "Tests de caractérisation"
alias: ["golden master"]
categorie: tests
liens: [strangler-fig]
niveaux:
  confirme: "Sait qu'on peut figer le comportement actuel d'un vieux code avant de le modifier."
  senior: "Capture les sorties actuelles sur des entrées réelles et vérifie que le nouveau code produit les mêmes."
  lead: "En fait le préalable de toute refonte d'un module critique non testé."
---

Un vieux module critique, sans tests : on **enregistre ce qu'il produit aujourd'hui** sur
un grand nombre d'entrées, puis on vérifie que le code modifié produit la même chose.

On teste le comportement réel, pas le comportement supposé.
