#!/usr/bin/env bash
# Ajoute au projet Mind Kata ce dont l'examinateur IA a besoin (ADR 0009) : Vertex AI,
# un compteur de consommation dans Firestore, le code d'accès et la clé de session dans
# Secret Manager, et les droits du compte d'exécution. Suppose infra/bootstrap.sh passé.
#
# À blanc par défaut : affiche ce qui serait créé. `--appliquer` pour exécuter.
#   infra/examinateur.sh
#   infra/examinateur.sh --appliquer
#
# Mêmes règles que bootstrap.sh : création ou ajout uniquement, arrêt sur toute ressource
# qui n'est pas au projet, relançable. Les secrets existants ne sont jamais régénérés.
#
# Le code d'accès est affiché une seule fois, à sa création : lancer --appliquer dans un
# terminal à soi, pas dans un outil qui enregistre la sortie.

set -euo pipefail

readonly PROJECT_ID="mind-kata"
readonly REGION="europe-west1"
readonly SA_EXECUTION_EMAIL="execution-web@${PROJECT_ID}.iam.gserviceaccount.com"
readonly SECRET_CODE="examinateur-code-empreinte"
readonly SECRET_SESSION="examinateur-cle-session"

APPLIQUER=false
[[ "${1:-}" == "--appliquer" ]] && APPLIQUER=true

# shellcheck source=infra/commun.sh
source "$(dirname "$0")/commun.sh"

# --- Projet --------------------------------------------------------------------------

etape "Projet ${PROJECT_ID}"
label=$(gcloud projects describe "$PROJECT_ID" --format='value(labels.app)' 2>/dev/null) \
  || arret "Projet ${PROJECT_ID} introuvable : lancer d'abord infra/bootstrap.sh."
[[ "$label" == "mind-kata" ]] \
  || arret "Le projet ${PROJECT_ID} n'a pas le label app=mind-kata : il n'est pas à ce script, arrêt."
existe gcloud iam service-accounts describe "$SA_EXECUTION_EMAIL" --project="$PROJECT_ID" \
  || arret "Compte d'exécution ${SA_EXECUTION_EMAIL} introuvable : lancer d'abord infra/bootstrap.sh."
info "existe, avec son compte d'exécution"

# --- API -----------------------------------------------------------------------------

etape "API"
executer gcloud services enable --project="$PROJECT_ID" \
  aiplatform.googleapis.com \
  firestore.googleapis.com \
  secretmanager.googleapis.com

# Tant que les API ne sont pas actives (à blanc), les lectures qui suivent échouent :
# tout apparaît alors comme à créer.
api_active() {
  gcloud services list --enabled --project="$PROJECT_ID" \
    --filter="config.name=$1" --format='value(config.name)' 2>/dev/null | grep -q .
}

# --- Firestore -----------------------------------------------------------------------

etape "Firestore (${REGION})"
# Seule la base « (default) » bénéficie des limites gratuites ; elle ne contiendra que
# le compteur de consommation.
if api_active firestore.googleapis.com \
  && existe gcloud firestore databases describe --database='(default)' --project="$PROJECT_ID"; then
  info "base (default) existe"
else
  executer gcloud firestore databases create --project="$PROJECT_ID" \
    --database='(default)' --location="$REGION" --type=firestore-native \
    --delete-protection
fi

# --- Secrets -------------------------------------------------------------------------

etape "Secrets"
secret_existe() {
  api_active secretmanager.googleapis.com \
    && existe gcloud secrets describe "$1" --project="$PROJECT_ID"
}

# La valeur passe par l'entrée standard : elle n'apparaît ni dans la ligne de commande
# (visible dans la liste des processus), ni sur le disque, ni à l'écran.
ajouter_version() {
  local nom=$1 valeur=$2 tentative
  if ! $APPLIQUER; then
    printf '  \033[33m[à blanc]\033[0m gcloud secrets versions add %s --data-file=- (valeur générée)\n' "$nom"
    return 0
  fi
  printf '  \033[36m+\033[0m gcloud secrets versions add %s --data-file=- (valeur générée)\n' "$nom"
  for tentative in 1 2 3 4 5; do
    printf '%s' "$valeur" | gcloud secrets versions add "$nom" --project="$PROJECT_ID" --data-file=- && return 0
    ((tentative < 5)) || return 1
    sleep 20
  done
}

creer_secret() {
  executer gcloud secrets create "$1" --project="$PROJECT_ID" \
    --replication-policy=user-managed --locations="$REGION" --labels=app=mind-kata
}

code_acces=""
if secret_existe "$SECRET_CODE"; then
  info "${SECRET_CODE} existe (code d'accès inchangé)"
else
  # 16 caractères sur 32 symboles sans ambiguïté de lecture (ni 0/o, ni 1/l) : 80 bits,
  # assez pour qu'une empreinte SHA-256 suffise, sans fonction de hachage lente.
  # Tampon de taille fixe plutôt que /dev/urandom en flux : avec pipefail, `head` qui
  # ferme le tube ferait échouer le script (SIGPIPE).
  code_acces=$(openssl rand 1024 | LC_ALL=C tr -dc 'abcdefghijkmnpqrstuvwxyz23456789' | head -c 16)
  ((${#code_acces} == 16)) || arret "Génération du code d'accès incomplète, relancer."
  empreinte=$(printf '%s' "$code_acces" | openssl dgst -sha256 -r | cut -d' ' -f1)
  creer_secret "$SECRET_CODE"
  ajouter_version "$SECRET_CODE" "$empreinte"
fi

if secret_existe "$SECRET_SESSION"; then
  info "${SECRET_SESSION} existe"
else
  creer_secret "$SECRET_SESSION"
  ajouter_version "$SECRET_SESSION" "$(openssl rand -base64 32)"
fi

# --- Droits du compte d'exécution ----------------------------------------------------

etape "Droits du compte d'exécution"
executer gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EXECUTION_EMAIL}" --role="roles/aiplatform.user" --condition=None
executer gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EXECUTION_EMAIL}" --role="roles/datastore.user" --condition=None
# Lecture limitée aux deux secrets de l'examinateur, pas à tout Secret Manager.
for secret in "$SECRET_CODE" "$SECRET_SESSION"; do
  executer gcloud secrets add-iam-policy-binding "$secret" --project="$PROJECT_ID" \
    --member="serviceAccount:${SA_EXECUTION_EMAIL}" --role="roles/secretmanager.secretAccessor"
done

# --- Étapes manuelles ----------------------------------------------------------------

etape "À faire dans la console"
cat <<EOF
  Quotas : abaisser les requêtes par minute du modèle Gemini retenu, garde-fou contre
  une boucle qui s'emballe.
  https://console.cloud.google.com/iam-admin/quotas?project=${PROJECT_ID}
EOF

if [[ -n "$code_acces" ]] && $APPLIQUER; then
  etape "Code d'accès (affiché une seule fois, à garder dans un gestionnaire de mots de passe)"
  printf '  %s-%s-%s-%s\n' "${code_acces:0:4}" "${code_acces:4:4}" "${code_acces:8:4}" "${code_acces:12:4}"
fi

$APPLIQUER || printf '\n\033[33mMode à blanc : rien n'"'"'a été modifié. Relancer avec --appliquer.\033[0m\n'
