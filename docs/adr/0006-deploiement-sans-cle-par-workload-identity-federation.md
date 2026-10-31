# 0006 — Déploiement sans clé, par Workload Identity Federation

- Statut : acceptée
- Date : 2026-10-31

## Contexte

GitHub Actions doit pousser des images dans Artifact Registry et déployer sur Cloud
Run. Le dépôt est public : toute fuite d'identifiant serait exploitable immédiatement.

## Options envisagées

1. **Clé JSON de compte de service** en secret GitHub : simple, mais une clé longue
   durée, à faire tourner, et exploitable de n'importe où si elle fuit.
2. **Workload Identity Federation** : GitHub émet pour chaque run un jeton OIDC signé ;
   GCP l'échange contre un accès de courte durée, si les conditions sont remplies.

## Décision

Option 2, avec les restrictions suivantes :

- Le fournisseur n'accepte que les jetons du dépôt, identifié par son **identifiant
  numérique** (jamais réattribué, contrairement au nom), et de la branche `main` : une
  PR, une autre branche ou un fork ne peut pas déployer.
- Le compte de déploiement a le minimum : déployer sur Cloud Run, écrire dans le seul
  dépôt d'images, attacher le seul compte d'exécution.
- Le service tourne sous un compte d'exécution dédié **sans aucun rôle**, au lieu du
  compte Compute par défaut, éditeur du projet.
- Seul le job qui parle à GCP reçoit la permission `id-token: write`.

## Conséquences

- Aucun secret GCP dans GitHub : les variables du dépôt (projet, fournisseur, comptes)
  sont publiques par nature et inutilisables sans jeton valide.
- Rien à faire tourner ni à révoquer.
- Déployer depuis un poste local demande une authentification personnelle explicite :
  le chemin normal reste le merge sur `main`.
