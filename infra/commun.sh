# Fonctions partagées des scripts d'infrastructure, chargées par `source`.
# Le script appelant définit APPLIQUER (true ou false) avant tout appel à `executer`.

existe() { "$@" >/dev/null 2>&1; }
info() { printf '  \033[32m✓\033[0m %s\n' "$*"; }
arret() { printf '\n\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }
etape() { printf '\n\033[1m%s\033[0m\n' "$*"; }

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
