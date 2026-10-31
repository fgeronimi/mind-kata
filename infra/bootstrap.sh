#!/usr/bin/env bash
# Prépare le projet GCP de Mind Kata pour un déploiement Cloud Run depuis GitHub Actions,
# sans clé de compte de service (Workload Identity Federation).
#
# À blanc par défaut : affiche ce qui serait créé. `--appliquer` pour exécuter.
#   BILLING_ACCOUNT=XXXXXX-XXXXXX-XXXXXX infra/bootstrap.sh
#   BILLING_ACCOUNT=XXXXXX-XXXXXX-XXXXXX infra/bootstrap.sh --appliquer
#
# Le script ne fait que créer ou ajouter : aucune suppression, aucun remplacement de
# politique IAM. Il s'arrête net sur toute ressource existante qui n'est pas à lui.
# Relançable : ce qui existe déjà est laissé tel quel.
#
# Remplacé par Terraform au lot 3 (les ressources seront importées).

set -euo pipefail

readonly PROJECT_ID="mind-kata"
readonly PROJECT_NAME="Mind Kata"
readonly REGION="europe-west1"
readonly LABEL="app=mind-kata"
readonly BUDGET_MENSUEL="${BUDGET_MENSUEL:-10}"

# Identifiants numériques GitHub : contrairement au nom, ils ne sont jamais réattribués
# si le dépôt est supprimé ou renommé.
readonly GITHUB_REPO="fgeronimi/mind-kata"
readonly GITHUB_REPO_ID="1440272035"

readonly AR_REPO="mind-kata"
readonly SA_DEPLOIEMENT="deploiement-github"
readonly SA_EXECUTION="execution-web"
readonly WIF_POOL="github"
readonly WIF_PROVIDER="github-actions"

readonly SA_DEPLOIEMENT_EMAIL="${SA_DEPLOIEMENT}@${PROJECT_ID}.iam.gserviceaccount.com"
readonly SA_EXECUTION_EMAIL="${SA_EXECUTION}@${PROJECT_ID}.iam.gserviceaccount.com"

APPLIQUER=false
[[ "${1:-}" == "--appliquer" ]] && APPLIQUER=true

: "${BILLING_ACCOUNT:?Définir BILLING_ACCOUNT (gcloud billing accounts list)}"

existe() { "$@" >/dev/null 2>&1; }
info() { printf '  \033[32m✓\033[0m %s\n' "$*"; }
arret() { printf '\n\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

executer() {
  if $APPLIQUER; then
    printf '  \033[36m+\033[0m %s\n' "$*"
    # Une API tout juste activée peut répondre PERMISSION_DENIED pendant environ une
    # minute, le temps que l'activation se propage.
    local tentative
    for tentative in 1 2 3 4 5; do
      "$@" && return 0
      ((tentative < 5)) || return 1
      printf '  \033[33m… échec, nouvelle tentative dans 20 s (%d/4)\033[0m\n' "$tentative"
      sleep 20
    done
  else
    printf '  \033[33m[à blanc]\033[0m %s\n' "$*"
  fi
}

etape() { printf '\n\033[1m%s\033[0m\n' "$*"; }

# --- Projet --------------------------------------------------------------------------

etape "Projet ${PROJECT_ID}"
if existe gcloud projects describe "$PROJECT_ID"; then
  label=$(gcloud projects describe "$PROJECT_ID" --format='value(labels.app)')
  [[ "$label" == "mind-kata" ]] \
    || arret "Le projet ${PROJECT_ID} existe sans le label ${LABEL} : il n'est pas à ce script, arrêt."
  info "existe, label ${LABEL} présent"
  PROJET_EXISTE=true
else
  executer gcloud projects create "$PROJECT_ID" --name="$PROJECT_NAME" --labels="$LABEL"
  PROJET_EXISTE=$APPLIQUER
fi

# En mode à blanc sur un projet neuf, rien ne peut encore être lu : tout est à créer.
lire() { $PROJET_EXISTE && existe "$@"; }

# --- Facturation ---------------------------------------------------------------------

etape "Facturation"
if $PROJET_EXISTE; then
  actuel=$(gcloud billing projects describe "$PROJECT_ID" --format='value(billingAccountName)')
  if [[ -z "$actuel" ]]; then
    executer gcloud billing projects link "$PROJECT_ID" --billing-account="$BILLING_ACCOUNT"
  elif [[ "$actuel" == "billingAccounts/${BILLING_ACCOUNT}" ]]; then
    info "rattaché à ${BILLING_ACCOUNT}"
  else
    arret "Le projet est rattaché à ${actuel}, pas à ${BILLING_ACCOUNT} : arrêt."
  fi
else
  executer gcloud billing projects link "$PROJECT_ID" --billing-account="$BILLING_ACCOUNT"
fi

# --- API -----------------------------------------------------------------------------

etape "API"
# `services enable` est additif et sans effet sur une API déjà active.
executer gcloud services enable --project="$PROJECT_ID" \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  sts.googleapis.com \
  cloudresourcemanager.googleapis.com \
  billingbudgets.googleapis.com

# --- Budget --------------------------------------------------------------------------

etape "Budget mensuel (${BUDGET_MENSUEL}, alertes à 50 %, 90 %, 100 %)"
budget_existant=""
if $PROJET_EXISTE; then
  budget_existant=$(gcloud billing budgets list --billing-account="$BILLING_ACCOUNT" \
    --billing-project="$PROJECT_ID" \
    --filter="displayName=${PROJECT_ID}" --format='value(name)' 2>/dev/null || true)
fi
if [[ -n "$budget_existant" ]]; then
  info "existe"
else
  # Un budget alerte, il ne coupe rien : la facturation continue au-delà.
  executer gcloud billing budgets create \
    --billing-account="$BILLING_ACCOUNT" --billing-project="$PROJECT_ID" \
    --display-name="$PROJECT_ID" \
    --budget-amount="$BUDGET_MENSUEL" \
    --filter-projects="projects/${PROJECT_ID}" \
    --threshold-rule=percent=0.5 --threshold-rule=percent=0.9 --threshold-rule=percent=1.0
fi

# --- Artifact Registry ---------------------------------------------------------------

etape "Artifact Registry ${AR_REPO} (${REGION})"
if lire gcloud artifacts repositories describe "$AR_REPO" --project="$PROJECT_ID" --location="$REGION"; then
  info "existe"
else
  executer gcloud artifacts repositories create "$AR_REPO" --project="$PROJECT_ID" \
    --location="$REGION" --repository-format=docker --labels="$LABEL" \
    --description="Images de Mind Kata"
fi

# --- Comptes de service --------------------------------------------------------------

etape "Comptes de service"
# Compte d'exécution dédié et sans aucun rôle : sinon Cloud Run utiliserait le compte
# Compute par défaut, éditeur de tout le projet.
for sa in "$SA_DEPLOIEMENT:Déploiement depuis GitHub Actions" "$SA_EXECUTION:Exécution du service web"; do
  nom="${sa%%:*}"
  if lire gcloud iam service-accounts describe "${nom}@${PROJECT_ID}.iam.gserviceaccount.com" --project="$PROJECT_ID"; then
    info "${nom} existe"
  else
    executer gcloud iam service-accounts create "$nom" --project="$PROJECT_ID" --display-name="${sa#*:}"
  fi
done

etape "Droits du compte de déploiement"
# run.admin plutôt que run.developer : rendre le service public (allUsers invoker)
# exige de modifier sa politique IAM.
executer gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_DEPLOIEMENT_EMAIL}" --role="roles/run.admin" --condition=None
# Écriture limitée au seul dépôt d'images, pas à tout Artifact Registry.
executer gcloud artifacts repositories add-iam-policy-binding "$AR_REPO" \
  --project="$PROJECT_ID" --location="$REGION" \
  --member="serviceAccount:${SA_DEPLOIEMENT_EMAIL}" --role="roles/artifactregistry.writer"
# Le déployeur peut attacher le compte d'exécution au service, et seulement celui-là.
executer gcloud iam service-accounts add-iam-policy-binding "$SA_EXECUTION_EMAIL" \
  --project="$PROJECT_ID" \
  --member="serviceAccount:${SA_DEPLOIEMENT_EMAIL}" --role="roles/iam.serviceAccountUser"

# --- Workload Identity Federation ----------------------------------------------------

etape "Workload Identity Federation"
if lire gcloud iam workload-identity-pools describe "$WIF_POOL" --project="$PROJECT_ID" --location=global; then
  info "pool ${WIF_POOL} existe"
else
  executer gcloud iam workload-identity-pools create "$WIF_POOL" --project="$PROJECT_ID" \
    --location=global --display-name="GitHub Actions"
fi

if lire gcloud iam workload-identity-pools providers describe "$WIF_PROVIDER" \
  --project="$PROJECT_ID" --location=global --workload-identity-pool="$WIF_POOL"; then
  info "fournisseur ${WIF_PROVIDER} existe"
else
  # Seuls les jetons émis pour ce dépôt, sur la branche main, sont acceptés : une PR
  # ou une autre branche ne peut pas déployer.
  executer gcloud iam workload-identity-pools providers create-oidc "$WIF_PROVIDER" \
    --project="$PROJECT_ID" --location=global --workload-identity-pool="$WIF_POOL" \
    --display-name="Dépôt ${GITHUB_REPO}" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository_id=assertion.repository_id,attribute.ref=assertion.ref" \
    --attribute-condition="assertion.repository_id == '${GITHUB_REPO_ID}' && assertion.ref == 'refs/heads/main'"
fi

if $PROJET_EXISTE; then
  numero=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
else
  numero="<numéro-du-projet>"
fi
pool_complet="projects/${numero}/locations/global/workloadIdentityPools/${WIF_POOL}"

executer gcloud iam service-accounts add-iam-policy-binding "$SA_DEPLOIEMENT_EMAIL" \
  --project="$PROJECT_ID" --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${pool_complet}/attribute.repository_id/${GITHUB_REPO_ID}"

# --- Récapitulatif -------------------------------------------------------------------

etape "Variables GitHub à définir (Settings → Secrets and variables → Actions → Variables)"
# Ce ne sont pas des secrets : sans jeton OIDC valide émis pour ce dépôt, ils ne donnent
# accès à rien.
cat <<EOF
  GCP_PROJECT_ID           ${PROJECT_ID}
  GCP_REGION               ${REGION}
  GCP_WIF_PROVIDER         ${pool_complet}/providers/${WIF_PROVIDER}
  GCP_SA_DEPLOIEMENT       ${SA_DEPLOIEMENT_EMAIL}
  GCP_SA_EXECUTION         ${SA_EXECUTION_EMAIL}
  GCP_AR_REPO              ${AR_REPO}
EOF

$APPLIQUER || printf '\n\033[33mMode à blanc : rien n'"'"'a été modifié. Relancer avec --appliquer.\033[0m\n'
