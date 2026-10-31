---
id: backpressure
terme: "Backpressure"
alias: ["contre-pression"]
categorie: messagerie
liens: [load-shedding, rate-limiting]
niveaux:
  confirme: "Sait que quand l'entrée va plus vite que le traitement, il faut ralentir les producteurs ou ajouter des consommateurs."
  senior: "Surveille la profondeur des files, borne les files en mémoire, et propage le ralentissement aux producteurs."
  lead: "Fait de la profondeur des files un indicateur d'alerte et dimensionne la capacité à partir de ces mesures."
---

Si les producteurs envoient plus vite que les consommateurs ne traitent, la file grossit
sans fin. La contre-pression **renvoie le signal** vers l'amont.

## Réponses

- Ajouter des consommateurs (autoscaling sur la profondeur de file).
- Ralentir ou refuser côté producteur.
- Délester ce qui n'est pas prioritaire.

## Piège

Une file non bornée en mémoire finit par faire tomber le processus.
