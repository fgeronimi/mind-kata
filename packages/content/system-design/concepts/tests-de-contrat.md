---
id: tests-de-contrat
terme: "Tests de contrat"
alias: ["Pact", "contract testing"]
categorie: tests
liens: []
niveaux:
  confirme: "Sait qu'un test de contrat vérifie l'accord entre deux services sans les démarrer ensemble."
  senior: "Fait décrire au consommateur ses attentes et les fait vérifier par le fournisseur en CI, avant tout déploiement."
  lead: "Les impose aux frontières entre équipes, pour qu'aucune ne casse l'autre en déployant."
---

Le consommateur décrit ce qu'il attend d'une API ; le fournisseur vérifie en CI qu'il
respecte ces attentes. On sait **avant de déployer** si l'on casse quelqu'un.

Moins lourd que des tests de bout en bout entre services.
