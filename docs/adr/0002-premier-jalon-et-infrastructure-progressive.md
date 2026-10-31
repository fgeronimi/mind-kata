# 0002 — Premier jalon court, infrastructure progressive

- Statut : acceptée
- Date : 2026-10-30

## Contexte

Le périmètre cible est large : multi-domaines, coach IA, contributions avec review
automatique, ingestion de documents, mode recruteur. Tout concevoir et provisionner
d'emblée repousserait la première mise en ligne de plusieurs mois, sans retour d'usage
pour arbitrer la suite.

## Options envisagées

1. **Infrastructure cible dès le départ** : Cloud SQL, Pub/Sub, workers, Terraform,
   deux environnements. Coût fixe immédiat et beaucoup de pièces avant la première
   valeur.
2. **Hébergement statique (Firebase Hosting)** pour le premier jalon, puis migration :
   le moins cher, mais un changement d'hébergeur dès le lot 3.
3. **Un conteneur Next.js sur Cloud Run**, infrastructure ajoutée lot par lot.

## Décision

Premier jalon = site déployé, contenu migré, exercices en arbre jouables (lots 0 à 2),
sans base ni API. Hébergement sur Cloud Run dès le départ (option 3) : la cible
définitive, à zéro instance au repos.

Pour ce jalon :

- **Un seul projet GCP** (production), en `europe-west1` : tarifs de premier niveau et
  catalogue de services complet. La recette arrive avec Terraform.
- **Préparation par un script `gcloud`** (`infra/bootstrap.sh`) plutôt que Terraform :
  quinze ressources créées une fois. Le script est à blanc par défaut, ne fait que
  créer ou ajouter, et s'arrête sur toute ressource qu'il n'a pas créée.
- **Terraform au lot 3**, avec Cloud SQL : les ressources existantes y seront importées,
  pas recréées.

## Conséquences

- Mise en ligne dès le lot 0, déploiement continu en place avant la première ligne de
  code métier.
- Coût au repos quasi nul ; budget avec alertes et plafond d'instances.
- Une dette assumée : le script ne détecte pas la dérive. Elle est remboursée au lot 3.
- Chaque lot ajoute seulement l'infrastructure qu'il consomme.
