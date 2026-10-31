---
id: anti-corruption-layer
terme: "Couche anti-corruption"
alias: ["anti-corruption layer", "ACL"]
categorie: architecture
liens: [strangler-fig, adapter]
niveaux:
  confirme: "Sait qu'une couche de traduction protège son modèle des défauts d'un système externe ou ancien."
  senior: "La place à la frontière avec chaque système externe, et y concentre toute la traduction des formats et des concepts."
  lead: "L'impose lors des migrations progressives, pour que le nouveau système n'hérite pas des défauts de l'ancien."
---

Une couche, à la frontière, qui **traduit** le modèle d'un système externe ou ancien vers
le nôtre. Le reste du code ne voit jamais le format étranger.

Rien à voir avec les listes de contrôle d'accès de sécurité.

## Piège

Une couche de plus à maintenir : elle se justifie par la valeur du modèle protégé.
