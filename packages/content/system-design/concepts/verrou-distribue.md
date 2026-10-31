---
id: verrou-distribue
terme: "Verrou distribué"
alias: ["distributed lock"]
categorie: infrastructure
liens: [sans-etat]
niveaux:
  confirme: "Sait qu'un verrou distribué garantit qu'une seule instance exécute une tâche à la fois."
  senior: "L'implémente (cache partagé ou base) avec une durée d'expiration, pour les tâches planifiées sur plusieurs instances."
  lead: "Préfère une conception qui n'en a pas besoin (file, idempotence) quand c'est possible."
---

Avec plusieurs instances, une tâche planifiée tourne… plusieurs fois. Un verrou distribué
garantit qu'**une seule** l'exécute.

## Piège

Toujours une expiration : une instance qui plante ne doit pas garder le verrou à jamais.
