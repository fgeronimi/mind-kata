---
id: coherence-a-terme
terme: "Cohérence à terme"
alias: ["eventual consistency", "cohérence forte"]
categorie: donnees
liens: [cap, read-your-writes]
niveaux:
  confirme: "Sait que les copies d'une donnée convergent après un délai, et que la cohérence forte n'est nécessaire que pour certaines données."
  senior: "Choisit la cohérence forte pour l'argent, les stocks et les droits, à terme ailleurs, et fait formuler le délai acceptable."
  lead: "Fait expliciter par le produit ce qui peut être temporairement incohérent, et pendant combien de temps."
---

- **Forte** : tout le monde lit la dernière écriture. Pour l'argent, les stocks, les droits.
- **À terme** : les copies convergent après un délai. Pour un compteur de vues, un avis,
  un index de recherche.

Toujours formuler le délai avec le produit : « une modification est visible partout en
moins de X minutes ».
