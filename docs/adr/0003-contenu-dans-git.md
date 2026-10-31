# 0003 — Contenu dans Git, brouillons en base

- Statut : acceptée
- Date : 2026-10-30

## Contexte

Le contenu (concepts, arbres de réponses, scénarios de simulation) est le cœur de la
valeur et son goulot. Il doit être relu, versionné, validé contre un format, et
pouvoir recevoir des contributions extérieures sans perdre en qualité.

## Options envisagées

1. **Contenu en base, édité via une interface d'administration** : édition immédiate,
   mais historique, relecture et validation à reconstruire, et contenu invisible pour
   qui lit le dépôt.
2. **CMS headless externe** : interface d'édition prête, mais un service de plus, un
   modèle imposé et un contenu hors du dépôt.
3. **Fichiers Markdown et YAML dans le dépôt**, validés par schéma au build.

## Décision

Option 3. Un fichier par élément dans `packages/content/<domaine>/`, avec un en-tête
YAML validé par un schéma Zod ; un fichier invalide fait échouer la CI.

La base ne stocke que des **identifiants** de contenu (tentatives, progression,
sessions) et les **brouillons de contribution** avant qu'ils deviennent une PR.

## Conséquences

- Historique, relecture et retour arrière gratuits : une modification de contenu est
  une PR comme une autre.
- Les pages de contenu sont générées au build : rapides et sans base.
- Les contributions passent par un flux asynchrone (formulaire, worker, PR, review IA,
  validation humaine) plutôt que par une écriture directe.
- Publier du contenu demande un redéploiement ; acceptable au rythme d'édition prévu.
- Un identifiant de contenu supprimé laisse des références orphelines en base : les
  lectures doivent le tolérer.
