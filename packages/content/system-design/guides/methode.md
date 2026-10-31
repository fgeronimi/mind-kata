---
id: methode
titre: La méthode en six temps
resume: L'examinateur note le raisonnement et les arbitrages, pas la solution. Un déroulé à suivre à voix haute, du cadrage au passage en production.
ordre: 1
---

L'examinateur note le raisonnement et les arbitrages, pas la solution. Toujours dérouler
dans cet ordre, en pensant à voix haute.

1. **Cadrer (5 à 10 minutes).** Poser les questions ci-dessous, puis **récapituler les
   contraintes en trente secondes** avant de proposer quoi que ce soit.
2. **Estimer.** Requêtes par seconde moyennes et en pic, volume de données, croissance.
   Juste assez pour justifier les choix.
3. **Vue d'ensemble.** Un schéma simple : clients, point d'entrée, services, stockage,
   asynchrone, cache, tiers. Le résumer en une phrase.
4. **Approfondir un ou deux points.** Là où se trouve la vraie difficulté : le goulot
   sous la charge, la cohérence des données, l'intégration fragile.
5. **Expliciter les arbitrages.** « J'ai choisi X plutôt que Y parce que… ; si Z change,
   je passerais à… »
6. **Passage en production.** Découpage en lots, équipe, migration, exploitation,
   indicateurs, risques.

## Questions de cadrage

- **Fonctionnel** : qui sont les utilisateurs, quels sont les deux ou trois cas d'usage
  principaux, qu'est-ce qui est hors périmètre ?
- **Existant** : qu'est-ce qui tourne aujourd'hui, avec quelle API, quelle stack,
  quelles douleurs ?
- **Volumétrie** : nombre d'utilisateurs, de clients, d'objets ; trafic moyen et pics
  (quand, combien) ; ratio lecture / écriture.
- **Fraîcheur et cohérence** : en combien de temps une modification doit-elle être
  visible ? Peut-on afficher une donnée légèrement périmée ?
- **Disponibilité** : quel est le coût d'une panne ? Combien de temps et de données
  peut-on perdre (RTO, RPO) ?
- **Données** : sensibles ou personnelles ? Plusieurs clients sur la même plateforme ?
  Utilisateurs à l'étranger ?
- **Contraintes** : délai, taille et maturité de l'équipe, budget, engagements
  contractuels.
- **Succès** : quel indicateur métier dit que le projet a réussi ?
