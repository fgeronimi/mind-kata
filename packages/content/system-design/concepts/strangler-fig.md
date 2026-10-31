---
id: strangler-fig
terme: Strangler fig
alias: [figuier étrangleur]
categorie: architecture
liens: []
niveaux:
  confirme: Sait qu'on remplace un ancien système progressivement, fonctionnalité par fonctionnalité, au lieu de tout basculer d'un coup.
  senior: Place un routeur devant les deux systèmes, migre fonctionnalité par fonctionnalité ou client par client, et protège le nouveau modèle de l'ancien par une couche de traduction.
  lead: Planifie la migration en lots qui apportent chacun de la valeur, mesure les mêmes indicateurs avant et après, et fixe une date de fin de l'ancien système.
---

Le figuier étrangleur pousse autour d'un arbre hôte jusqu'à le remplacer. Pour un
système, on construit le nouveau **à côté** de l'ancien et on lui transfère le trafic
**petit à petit**, sans big bang.

## Comment

1. Un **routeur** (passerelle, proxy) devant les deux systèmes.
2. Une première fonctionnalité réécrite ; le routeur lui envoie son trafic.
3. Ainsi de suite, jusqu'à ce que l'ancien système ne reçoive plus rien.

On peut aussi basculer **client par client**, en commençant par des clients pilotes
volontaires.

## Pièges

- Sans date de fin, on maintient deux systèmes pour toujours.
- Les données partagées entre l'ancien et le nouveau sont la partie difficile.
- Des tests de caractérisation sur l'ancien système permettent de vérifier que le nouveau
  produit le même résultat.
