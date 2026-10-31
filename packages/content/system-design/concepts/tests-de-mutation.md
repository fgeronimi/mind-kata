---
id: tests-de-mutation
terme: "Tests de mutation"
alias: ["Infection", "Stryker"]
categorie: tests
liens: []
niveaux:
  confirme: "Sait que les tests de mutation vérifient que les tests détectent vraiment les erreurs."
  senior: "Les lance sur le code métier critique et renforce les tests là où les mutations survivent."
  lead: "Les préfère à la couverture de code comme indicateur de qualité des tests."
---

L'outil modifie le code (un `>` devient `>=`) et vérifie qu'au moins un test échoue. Une
mutation qui survit révèle un test trop faible.

La couverture dit ce qui est exécuté, la mutation dit ce qui est **vérifié**.
