---
id: sans-etat
terme: "Sans état"
alias: ["stateless"]
categorie: infrastructure
liens: [scalabilite]
niveaux:
  confirme: "Sait qu'une instance sans état peut traiter n'importe quelle requête."
  senior: "Sort l'état des serveurs : sessions dans un cache partagé ou un jeton, fichiers sur un stockage objet."
  lead: "En fait une règle pour tous les services, condition de l'autoscaling."
---

Aucune donnée propre à un utilisateur ne vit sur une instance : n'importe laquelle peut
répondre, et on peut en ajouter ou en retirer à tout moment.

Sessions dans un cache partagé ou dans un jeton ; fichiers sur un stockage objet.
