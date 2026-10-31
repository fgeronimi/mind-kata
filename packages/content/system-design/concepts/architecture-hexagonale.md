---
id: architecture-hexagonale
terme: "Architecture hexagonale"
alias: ["ports et adaptateurs"]
categorie: architecture
liens: [adapter, repository]
niveaux:
  confirme: "Sait que l'architecture hexagonale isole le métier de l'infrastructure."
  senior: "Fait définir par le domaine des interfaces (ports) que l'infrastructure implémente (adaptateurs), et teste le domaine sans base ni réseau."
  lead: "L'applique aux modules au métier riche, pas aux modules simples."
---

Le domaine définit ce dont il a besoin sous forme d'**interfaces** (les ports) ; l'ORM,
les API tierces et l'interface utilisateur les **implémentent** (les adaptateurs).

Le métier se teste sans base ni réseau.

## Piège

En faire trop sur un module simple.
