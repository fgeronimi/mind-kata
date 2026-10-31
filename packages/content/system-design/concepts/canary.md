---
id: canary
terme: "Déploiement canary"
alias: ["canary release", "déploiement canari"]
categorie: deploiement
liens: [blue-green, feature-flag]
niveaux:
  confirme: "Sait qu'on peut envoyer une petite part du trafic sur la nouvelle version avant de l'élargir."
  senior: "Compare erreurs et latence entre les deux versions avant d'élargir, et revient en arrière automatiquement en cas d'écart."
  lead: "En fait le mode de déploiement standard des services critiques."
---

La nouvelle version reçoit d'abord **une petite part du trafic** ; on compare erreurs et
latence avec l'ancienne, puis on élargit.
