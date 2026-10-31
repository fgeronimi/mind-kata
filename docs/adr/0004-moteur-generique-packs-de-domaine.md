# 0004 — Moteur générique, domaines en packs

- Statut : acceptée
- Date : 2026-10-30

## Contexte

Le premier domaine est le system design, mais la mécanique (concepts par niveau,
réponses en arbre, simulations avec examinateur, contributions) s'applique à d'autres
disciplines : droit, finance, pratique clinique. Coder le system design en dur rendrait
chaque nouveau domaine coûteux.

## Options envisagées

1. **Application dédiée au system design**, généralisée plus tard si besoin : plus
   rapide au début, mais le vocabulaire du domaine se diffuse partout dans le code.
2. **Moteur générique configuré par des packs de domaine**, dès le premier domaine.

## Décision

Option 2. Un pack (`packages/content/<domaine>/domaine.yaml`) déclare son nom, sa
langue, ses catégories, ses niveaux et leurs libellés, les types de contenu utilisés,
le rôle du coach IA et ses critères de débrief, et les règles de review des
contributions. La configuration est validée par un schéma Zod.

Règle : aucun terme propre à un domaine dans le code du moteur (`apps/`,
`packages/core`).

## Conséquences

- Un nouveau domaine s'ajoute sans toucher au code.
- Le premier domaine sert de banc d'essai : chaque terme qu'on serait tenté de coder en
  dur révèle un champ manquant du pack.
- Coût initial modéré (un schéma et un niveau d'indirection), payé une fois.
- Risque de sur-généralisation : le schéma n'expose que ce que le premier domaine
  utilise réellement, et s'étend quand un second domaine le demande.
