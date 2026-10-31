---
id: monolithe-modulaire
terme: "Monolithe modulaire et microservices"
alias: ["microservices", "modular monolith"]
categorie: architecture
liens: [loi-de-conway, strangler-fig, anti-corruption-layer, saga]
niveaux:
  confirme: "Sait qu'on peut déployer une application d'un seul bloc ou en plusieurs services indépendants, et que les microservices ont un coût d'exploitation élevé."
  senior: "Découpe un monolithe en modules par domaine métier, avec une façade publique par module, des données possédées par chaque module et des frontières vérifiées automatiquement en CI."
  lead: "Part du monolithe modulaire, n'extrait un service que sur un signal concret (équipes qui se bloquent, charge très différente, besoin d'isolation) et tient compte de la loi de Conway."
---

- **Monolithe** : un déploiement, tout le monde accède à tout. Simple, jusqu'à devenir
  une « grosse boule de boue ».
- **Monolithe modulaire** : un déploiement, mais découpé par domaine métier, avec des
  frontières vérifiées en CI.
- **Microservices** : un déploiement par service. Autonomie des équipes, mais coût
  d'exploitation élevé et cohérence à terme partout.

Le défaut à défendre est le **monolithe modulaire** ; on extrait un service sur un signal
concret. Le guide « Monolithe, microservices, monolithe modulaire » détaille comment le
construire.

## Piège

Le **monolithe distribué** : des services qui ne peuvent pas être déployés les uns sans
les autres.
