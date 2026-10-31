---
id: loi-de-little
terme: "Loi de Little"
alias: ["Little"]
categorie: organisation
liens: []
niveaux:
  confirme: "Sait que le nombre de traitements simultanés est égal au débit multiplié par la durée."
  senior: "L'utilise pour dimensionner workers, connexions et files à partir d'un débit et d'une durée."
  lead: "L'utilise pour raisonner sur le travail en cours d'une équipe autant que d'un système."
---

**Traitements simultanés = débit × durée.**

14 requêtes par seconde qui durent 20 secondes : environ 280 en cours en permanence. Il
faut au moins autant de workers ou de connexions.
