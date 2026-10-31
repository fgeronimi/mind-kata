---
id: passage-en-production
titre: Le passage en production
resume: Ce qui distingue un profil lead d'un développeur senior — terminer chaque exercice en disant comment la cible arrive en production.
ordre: 7
---

Terminer chaque exercice en disant comment la cible arrive en production. C'est souvent
là que se joue la différence entre un profil senior et un profil lead.

## Découpage

- Un premier lot qui apporte de la valeur à un premier groupe d'utilisateurs, puis des
  lots qui élargissent.
- Identifier ce qui est sur le chemin critique et ce qui peut attendre.

## Migration

- Progressive, jamais en big bang : le nouveau système à côté de l'ancien, bascule client
  par client, feature flags.
- Clients pilotes volontaires d'abord ; commencer par ceux qui souffrent le plus de
  l'ancien système quand c'est possible.
- Les mêmes indicateurs mesurés avant et après, pour prouver le gain.
- Double run limité dans le temps, avec une date de fin de l'ancien système.
- Les cas particuliers (intégrations sur mesure, gros comptes) traités à part, une fois le
  standard stabilisé.

## Équipe

- Séparer l'exploitation et la construction sans créer deux castes : rotation au support.
- Ownership clair par domaine ou par connecteur.
- Dire qui porte les sujets qu'on ne maîtrise pas soi-même (référencement, sécurité,
  données).

## Exploitation

- Observabilité dès le premier lot, alertes sur ce que voit l'utilisateur.
- Astreinte et procédure d'incident ; post-mortem sans recherche de coupable.

## Indicateurs

Les quatre métriques DORA : fréquence de déploiement, délai entre commit et production,
taux d'échec des mises en production, temps de rétablissement après incident.

## Risques à nommer

Dépendance à une équipe ou à un tiers, engagements contractuels, perte de trafic ou de
référencement pendant la bascule, coût qui dérive.
