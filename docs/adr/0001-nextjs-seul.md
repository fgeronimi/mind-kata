# 0001 — Next.js seul, front et back

- Statut : acceptée
- Date : 2026-10-30

## Contexte

L'application sert surtout du contenu statique (concepts, architectures, exercices),
puis ajoute une logique serveur modeste : progression, sessions de simulation avec
streaming vers le navigateur, réception de contributions. Les traitements longs (PR
GitHub, ingestion de documents) passent par une file et des workers. Le projet est
porté par une seule personne : chaque brique en plus se paie en maintenance.

## Options envisagées

1. **Next.js + API séparée (NestJS)** : séparation nette, mais deux applications à
   déployer, deux jeux de conventions, des types à partager à travers une frontière
   HTTP et une API à versionner.
2. **Next.js seul** : pages, route handlers et server actions dans une même
   application ; workers en Node.js simple qui importent la même logique métier.
3. **Site statique + fonctions serverless** : économique, mais streaming et sessions
   plus laborieux, et logique dispersée entre fournisseurs.

## Décision

Next.js seul (App Router). La logique métier vit dans `packages/core`, indépendante du
framework, et est appelée par les pages, les route handlers, les server actions et les
workers.

## Conséquences

- Un seul déploiement, un seul langage, des types partagés de bout en bout sans
  génération de client.
- Le rendu statique couvre le contenu sans configuration ; le dynamique reste
  disponible route par route.
- Le risque de couplage au framework est contenu par `packages/core` : si une API
  séparée devenait nécessaire (clients mobiles, tiers), elle réutiliserait ce paquet.
- Les traitements longs ne doivent jamais tourner dans une requête Next : ils passent
  par Pub/Sub et les workers (lot 5).
