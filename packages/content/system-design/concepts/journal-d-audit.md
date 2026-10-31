---
id: journal-d-audit
terme: "Journal d'audit"
alias: ["append-only", "chaînage par hash", "piste d'audit"]
categorie: secteur-public
liens: [chiffrement, event-sourcing]
niveaux:
  confirme: "Sait qu'un journal d'audit enregistre qui a fait quoi et quand, sans possibilité de modification."
  senior: "L'implémente en ajout seul, chaîne les entrées par hash pour rendre toute altération détectable, et le stocke à part des données métier."
  lead: "Fixe avec le juridique ce qui doit être tracé et combien de temps, car le journal sert de preuve en cas de recours."
---

Chaque action significative est enregistrée : qui, quoi, quand, sur quel objet. Le
journal est en **ajout seul** : rien ne s'y modifie ni ne s'y supprime.

## Rendre l'altération détectable

Chaque entrée contient le hash de la précédente : modifier une entrée casse toute la
chaîne qui suit.

## Usages

Preuve en cas de recours, contrôle des accès aux données sensibles, enquête après
incident.

## Piège

Le journal contient des données personnelles : accès restreint et durée de conservation
définie.
