# 0005 — Score déterministe, IA pour les relances

- Statut : acceptée
- Date : 2026-10-30

## Contexte

Une bonne réponse en system design n'est pas un mot-clé mais un raisonnement : une
solution de base, puis des couches qui la précisent et la justifient. Le contenu
modélise donc la réponse attendue comme un **arbre** (nœud, synonymes, justification
attendue, alternatives conditionnelles, enfants).

Deux risques : un score qui récompense la récitation de vocabulaire (« name
dropping »), et un score rendu par un modèle de langage, non reproductible et
difficile à expliquer — inacceptable dès qu'une évaluation sert à décider.

## Options envisagées

1. **L'IA note directement la réponse libre** : simple, mais résultat variable d'un
   appel à l'autre et sans justification vérifiable.
2. **Correspondance de mots-clés** : déterministe, mais récompense précisément la
   récitation.
3. **Répartition des rôles** : l'IA interprète et questionne, du code calcule le score
   à partir de l'arbre.

## Décision

Option 3.

- **L'IA** rattache la réponse libre aux nœuds de l'arbre et conduit les relances : « à
  quoi sert cet élément ? », changement de contrainte, choix forcé, contre-exemple.
- **Le code** (`packages/core`) calcule le score : un nœud ne compte que si son parent
  a été cité ; il vaut davantage avec sa justification ; la profondeur atteinte indique
  un niveau.
- Vocabulaire et raisonnement sont scorés séparément ; des mots cités sans lien
  deviennent un signal d'alerte dans le débrief.

## Conséquences

- Même tentative, même score : le résultat se teste unitairement et s'explique nœud
  par nœud.
- La qualité dépend de celle des arbres : c'est le contenu, pas le prompt, qui porte
  l'exigence.
- La tentative est enregistrée comme un arbre (nœuds trouvés, liens, justifications),
  pas comme un booléen.
- L'erreur de l'IA reste possible au rattachement ; elle est visible et contestable,
  contrairement à une note opaque. En évaluation de candidats, la décision finale
  revient toujours à une personne.
