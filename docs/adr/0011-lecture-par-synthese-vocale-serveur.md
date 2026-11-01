# 0011 — Lecture à voix haute par une synthèse serveur, plafonnée au gratuit

- Statut : acceptée
- Date : 2026-11-02
- Amende : ADR 0009 (voix par les API du navigateur, sans coût)

## Contexte

Le lot B a branché la dictée et la lecture sur les API vocales du navigateur. À
l'usage, la dictée tient, y compris sur les termes techniques. La lecture, non : la
voix dépend du système et du navigateur, et sonne robotique. Pour un entraînement à
l'oral, une voix pénible à écouter fait couper le son.

## Options envisagées

1. **Choisir la meilleure voix installée** et proposer un sélecteur : gratuit, mais
   le plafond de qualité reste celui du système.
2. **Google Cloud Text-to-Speech, voix Chirp 3 HD** : voix naturelles, même projet et
   même compte d'exécution que Vertex AI. 1 million de caractères gratuits par mois,
   puis 30 $ par million.
3. **Gemini TTS** : facturé au jeton audio, sans franchise mensuelle.

## Décision

Option 2, la lecture plafonnée sous la franchise gratuite.

- Une séance lit environ 3 000 caractères : la franchise couvre plus de 300 séances
  par mois. Au-delà, une séance coûterait environ 9 centimes, quinze fois l'IA.
- Le quota est compté en caractères, l'unité de facturation, par le même compteur
  Firestore que le budget de l'IA (collection `voix`) : 900 000 caractères par mois,
  60 000 par jour, 500 appels par jour. Le plafond mensuel reste sous la franchise :
  la lecture ne coûte rien.
- La route est derrière le code d'accès et refuse plus de 1 000 caractères par appel.
  Elle synthétise le texte reçu sans vérifier qu'il vient de l'examinateur : signer
  chaque bulle compliquerait le client pour un risque borné à zéro euro par le quota.
- Quota atteint, panne ou fournisseur absent : le navigateur lit avec sa propre voix,
  jusqu'au rechargement de la page.
- La dictée reste dans le navigateur.

## Conséquences

- Environ une seconde entre l'affichage d'une bulle et sa lecture, le temps de la
  synthèse. Sans streaming, acceptable à ce volume.
- La franchise vaut probablement pour tout le compte de facturation : un autre projet
  qui utiliserait Text-to-Speech la consommerait aussi.
- Une dépendance de plus, `@google-cloud/text-to-speech`, derrière l'interface
  `Synthese` : changer de voix ou de prestataire ne touche que `lib/voix/`.
