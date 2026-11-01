# 0010 — Rattachement par IA, parents implicites et relances ciblées

- Statut : acceptée
- Date : 2026-11-01
- Précise : ADR 0005 (score déterministe) et ADR 0008 (règle du parent)

## Contexte

L'examinateur conversationnel (ADR 0009) est en ligne. Le premier usage réel montre :

- des **rattachements justes** : reformulations et négations sont bien traitées, là où
  le rapprochement lexical échouait ;
- une **règle du parent trop stricte** en conversation : décrire un phénomène sans le
  nommer (« toutes les requêtes recalculent la même clé en même temps ») ne validait
  pas « cache stampede », et tout ce qui en dépend était perdu ;
- des **relances vagues** (« comment amélioreriez-vous cela ? ») : le modèle choisissait
  seul quoi relancer, et le candidat ne voyait pas où l'on voulait en venir.

## Options envisagées

1. **Compter les orphelins à moitié** : moins frustrant, mais réciter des mots-clés
   rapporterait des points ; on perd le signal qui fait la valeur de l'arbre.
2. **Parents implicites reconnus par l'IA** : un élément dont l'idée est clairement
   exprimée compte, même sans son mot ; un remède cité sans raisonnement reste orphelin.
3. Pour les relances : **mieux les décrire dans la consigne**, ou **faire choisir la
   cible par le code** et laisser au modèle la seule formulation.

## Décision

Option 2 pour la règle du parent, et cible choisie par le code pour les relances.

- La règle du parent ne change pas dans le calcul : seule l'entrée change, l'IA cochant
  les parents dont l'idée est exprimée. Le score reste du code (ADR 0005).
- Un tour fait **deux appels** : le rattachement, puis, s'il reste une relance, sa
  formulation. La cible est l'élément manquant le plus proche de la racine dont le
  parent est acquis : la couche suivante du raisonnement, et le parent d'un orphelin
  avant l'orphelin lui-même.
- La relance part d'une conséquence concrète de la situation, en 25 mots au plus. Une
  relance qui contient le mot attendu ou un synonyme est écartée.
- Le verdict de fin de séance est calculé, lui aussi : le niveau atteint ou dépassé sur
  au moins la moitié des questions.

## Conséquences

- La reconnaissance des parents implicites n'existe qu'avec l'IA ; le repli lexical
  garde la règle stricte.
- Un appel de plus par relance : environ 0,02 centime, sans effet sur le budget.
- La qualité des relances dépend encore du champ `pourquoi` des nœuds, transmis au
  modèle : un `pourquoi` absent ou vague donne une relance plus floue.
- Le jeu d'évaluation prévu par l'ADR 0009 reste à construire : le modèle a été choisi
  sur le coût et sur des essais réels, pas encore sur une mesure.
