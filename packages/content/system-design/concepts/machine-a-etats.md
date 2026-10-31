---
id: machine-a-etats
terme: "Machine à états"
alias: ["workflow", "state machine"]
categorie: architecture
liens: [journal-d-audit, saga]
niveaux:
  confirme: "Sait qu'un objet métier passe par des états définis (brouillon, soumis, validé, refusé), avec des transitions autorisées entre eux."
  senior: "Modélise les états et les transitions explicitement avec un outil dédié plutôt qu'avec des conditions dispersées, garde chaque transition (droits, règles) et journalise l'historique des changements."
  lead: "Fait valider la machine à états par le métier comme référence commune, et en fait la source des écrans, des droits et des notifications."
---

Un dossier, une commande, un paiement passent par des **états** définis, et seules
certaines **transitions** sont permises : on ne valide pas un brouillon.

## Comment

- États et transitions déclarés explicitement, avec un outil dédié (le composant
  Workflow de Symfony, XState en TypeScript), plutôt que des `if` dispersés.
- Chaque transition a ses gardes (droits, règles) et déclenche ses effets
  (notifications).
- L'historique des transitions est journalisé.

## Piège

Un champ `statut` modifiable librement : n'importe quel état devient atteignable depuis
n'importe quel autre.
