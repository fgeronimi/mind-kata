# 0009 — MVP : un examinateur conversationnel, sans base de données

- Statut : acceptée
- Date : 2026-11-01
- Remplace, pour le lot suivant le premier jalon : le lot « back-end et progression »
  prévu par l'ADR 0002

## Contexte

Le premier jalon est en ligne : concepts, architectures, exercices éclair en arbre, sans
base ni API. Le lot suivant prévoyait comptes, base PostgreSQL et progression
sauvegardée. Deux constats changent la priorité :

- la valeur de l'outil tient à **l'échange** : être interrogé, relancé, puis évalué,
  comme à l'oral. Une progression sauvegardée ne l'apporte pas ;
- le budget est contraint : **pas de coût fixe d'infrastructure**, et l'argent disponible
  va à l'IA, quelques euros par mois.

## Options envisagées

1. **Garder le lot back-end** (comptes, Cloud SQL ou base gérée externe) : un coût fixe
   mensuel pour une fonction secondaire.
2. **Examinateur conversationnel sans base** : une interface de chat où l'IA pose les
   situations éclair, relance, rattache les réponses à l'arbre, puis rend un verdict de
   niveau. L'état de la séance vit dans le navigateur.
3. **Examinateur avec une base de sessions** : historique des échanges conservé côté
   serveur. Utile plus tard, prématuré tant que l'usage n'est pas validé.

## Décision

Option 2, en trois lots :

- **A. Examinateur texte** : séance de questions éclair en chat, relances, rattachement
  de la réponse aux nœuds par l'IA et **score calculé par le code** (ADR 0005), verdict
  de niveau en fin de séance. L'utilisateur ne choisit pas son niveau : il le découvre.
- **B. Voix** : micro en « appuyer pour parler » et réponse lue à voix haute, avec les
  API de reconnaissance et de synthèse vocales du navigateur, sans coût.
- **C. Fiche de séance** : les concepts manquants en fin de séance, avec un lien vers
  leur page, et une version imprimable.

Choix techniques :

- **Un modèle léger par Vertex AI**, choisi sur mesure entre **Claude Haiku** et
  **Gemini Flash-Lite** : l'appel s'authentifie avec le compte de service de Cloud Run,
  sans clé API à stocker, et la facturation suit le projet GCP et ses alertes.
  - Le modèle est caché derrière une interface de l'examinateur (rattacher une réponse à
    l'arbre, relancer, rendre le verdict), avec un adaptateur par fournisseur et un faux
    pour les tests.
  - Le choix se fait sur un **jeu d'évaluation** : une vingtaine de réponses rédigées
    sur des situations du pack, avec les nœuds attendus pour chacune. On mesure les nœuds
    trouvés, les faux positifs, la qualité des relances et le coût réel ; le jeu sert
    ensuite de test de non-régression du prompt.
  - Le coût ne départage pas : les deux tiennent largement dans le budget. La qualité
    en français, sur des réponses orales approximatives, décide.
  - Repli si l'activation d'un modèle tiers sur Vertex bloque : l'API de l'éditeur en
    direct, avec une clé dans Secret Manager.
- **Accès réservé** par un code d'accès, vérifié côté serveur : l'outil n'est pas ouvert
  au public tant que les coûts ne sont pas maîtrisés.
- **Plafonds de consommation appliqués par l'application**, parce qu'un budget GCP alerte
  mais ne coupe pas :
  - par appel : sortie bornée (`max_tokens`), entrée bornée (longueur des messages,
    contexte limité à la situation en cours et à la séance) ;
  - par séance : nombre de questions et de relances limité ;
  - par jour et par mois : un coût cumulé, estimé à partir des jetons réellement
    consommés que renvoie chaque réponse. Avant chaque appel, le coût maximal de l'appel
    est réservé ; s'il dépasse le plafond, l'appel n'a pas lieu.
  - Le compteur cumulé tient dans **un document Firestore**, dans les limites gratuites :
    un compteur en mémoire serait remis à zéro à chaque démarrage d'instance Cloud Run.
- **Repli** : quand un plafond est atteint ou que l'appel échoue, la séance bascule sur
  les exercices éclair existants, gratuits et sans IA (ADR 0008).

## Conséquences

- Coût fixe nul ; le coût variable est plafonné par le code, pas seulement surveillé.
- Firestore est la seule brique de stockage ajoutée, limitée à un compteur ; aucune
  donnée personnelle ni historique de séance n'est conservé côté serveur.
- Le rattachement par IA remplace le rapprochement lexical dans le chat ; le lexical
  reste le repli. Le score reste déterministe et testable.
- Sans compte, la progression reste dans le navigateur ; les comptes reviendront si
  l'usage le justifie.
- Les tarifs et la disponibilité des modèles sur Vertex sont fixés par Google : les
  constantes de coût sont dans la configuration et vérifiées à la mise en place.
- Changer de modèle revient à changer d'adaptateur et à repasser le jeu d'évaluation.
