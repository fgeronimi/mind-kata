# 0008 — Rapprochement lexical des réponses, avant l'IA

- Statut : acceptée, à réviser avec le lot qui introduira l'IA dans le rapprochement
- Date : 2026-10-31

## Contexte

Un exercice éclair attend une réponse en arbre (ADR 0005) : l'utilisateur répond en
texte libre, et il faut savoir quels nœuds de l'arbre il a cités. L'IA n'arrive qu'avec
le coach (lot 4) ; le premier jalon doit fonctionner sans elle, sans base ni API.

## Options envisagées

1. **Auto-évaluation seule** : l'utilisateur coche ce qu'il pense avoir dit. Simple, mais
   l'effort de rédaction ne sert à rien.
2. **Rapprochement lexical** : la réponse est comparée aux mots, synonymes et
   alternatives de chaque nœud, après normalisation (casse, accents, ponctuation), sur
   des mots entiers. L'utilisateur corrige ensuite.
3. **Rapprochement par IA** dès maintenant : plus juste, mais un service payant et une
   API à opérer avant même le premier jalon.

## Décision

Option 2, en **proposition corrigeable** : les nœuds reconnus sont cochés, l'utilisateur
coche ce qu'il a formulé autrement et décoche les faux positifs ; le score suit.

La règle de score est durcie par rapport à la première formulation : un nœud compte s'il
est cité **et que son parent compte**. Il faut une chaîne continue jusqu'à la racine ; un
mot cité sans ce qui y mène est un **orphelin**, signalé et sans valeur. Le niveau atteint
ignore les orphelins.

Les justifications (« pourquoi ») ne sont pas évaluées : sans compréhension du texte, ce
ne serait pas fiable.

## Conséquences

- Score déterministe, testé unitairement et de bout en bout, sans coût ni dépendance.
- La qualité dépend des **synonymes** déclarés dans le contenu ; un test vérifie que
  chaque nœud est au moins reconnu par son propre mot.
- **Limites connues**, qui seront atteintes vite : une reformulation absente des
  synonymes, une négation (« je ne mettrais pas de cache ») ou un mot juste dans un
  mauvais contexte trompent le rapprochement. La correction manuelle les compense
  pour l'entraînement, pas pour une évaluation.
- **Évolution prévue** : un lot dédié confiera le rattachement de la réponse aux nœuds à
  l'IA, avec repli sur le rapprochement lexical si l'appel échoue. Le calcul du score
  reste du code (ADR 0005) : seule l'entrée change.
