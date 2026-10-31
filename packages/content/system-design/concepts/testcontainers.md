---
id: testcontainers
terme: "Testcontainers"
alias: ["tests d'intégration"]
categorie: tests
liens: []
niveaux:
  confirme: "Sait qu'on peut démarrer une vraie base dans un conteneur pendant les tests."
  senior: "Écrit les tests d'intégration contre de vrais services en conteneur plutôt que contre des doublures."
  lead: "Arbitre entre fidélité et vitesse de la CI, et fixe la règle de l'équipe sur ce qui se teste contre de vrais services et ce qui se teste avec des doublures."
---

Les tests d'intégration démarrent une **vraie** base, un vrai cache, un vrai broker dans
des conteneurs jetables. Pas de surprise entre la doublure et la production.
