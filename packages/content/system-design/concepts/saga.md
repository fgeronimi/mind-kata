---
id: saga
terme: Saga
alias: [compensation]
categorie: architecture
liens: [idempotence, outbox]
niveaux:
  confirme: Sait qu'une saga enchaîne les étapes d'une opération qui traverse plusieurs services, avec une action de compensation pour annuler en cas d'échec.
  senior: Choisit entre orchestration et chorégraphie, écrit des étapes et des compensations idempotentes, et suit l'état de chaque saga.
  lead: Évite la saga quand un seul service suffit, et fait expliciter au produit les états intermédiaires visibles par l'utilisateur.
---

Une commande touche le paiement, le stock et la livraison, chacun dans son service :
pas de transaction globale possible. La saga découpe l'opération en **étapes locales**,
chacune avec sa **compensation**.

## Exemple

Réserver une chambre, puis débiter le client. Si le paiement échoue, la compensation
libère la chambre. Si l'annulation arrive après le paiement, la compensation rembourse.

## Deux styles

- **Orchestration** : un coordinateur appelle chaque étape et déclenche les
  compensations. Le déroulé se lit à un seul endroit.
- **Chorégraphie** : chaque service réagit aux événements des autres. Moins de couplage,
  mais le déroulé devient vite illisible.

## Pièges

- Une compensation n'est pas un retour arrière : le client a pu voir l'état
  intermédiaire, un e-mail est peut-être parti.
- Les étapes et les compensations sont réessayées : elles doivent être idempotentes.
- Souvent le signe d'un découpage en services trop fin.
