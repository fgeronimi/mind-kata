---
id: attestation-signee
titre: Attestation signée à la demande
enonce: >-
  Un service public en ligne permet à chacun de télécharger une attestation officielle,
  générée et signée électroniquement. À l'ouverture, une forte affluence est attendue.
  Concevez le service.
chiffres:
  - libelle: Demandes le premier jour
    valeur: 300 000
  - libelle: Pic
    valeur: un tiers des demandes en deux heures
  - libelle: Génération et signature
    valeur: 20 secondes par attestation
  - libelle: Service de signature
    valeur: limité à 50 requêtes par seconde
recap: >-
  100 000 demandes en 7 200 secondes, soit environ 14 par seconde : sous la limite de 50
  du service de signature. Loi de Little : 14 × 20 s ≈ 280 traitements simultanés. Un
  traitement de 20 secondes ne peut pas tenir dans une requête HTTP : asynchrone.
relances:
  - Récapitulez les contraintes et posez les calculs avant de proposer quoi que ce soit.
  - Que voit l'usager entre sa demande et la réception de l'attestation ?
  - Le service de signature tombe en panne pendant le pic. Que se passe-t-il ?
  - Un usager clique trois fois sur « Demander ». Combien d'attestations reçoit-il ?
  - Un usager appelle le support, il n'a rien reçu. Comment le support l'aide-t-il ?
  - Comment savez-vous, pendant le pic, que tout se passe bien ?
grille:
  confirme:
    - Pose les calculs de débit et voit que la limite de signature n'est pas dépassée.
    - Propose un traitement asynchrone avec une file et des workers.
    - Répond tout de suite à l'usager avec un numéro de suivi.
  senior:
    - Utilise la loi de Little pour dimensionner les workers.
    - Fait de la base la source de vérité et prévoit un rattrapage des demandes bloquées.
    - Limite le débit vers le service de signature, avec timeout et disjoncteur.
    - Rend la demande idempotente.
    - Sépare la file d'échecs des pannes passagères du tiers.
  lead:
    - Pense au parcours complet de l'usager, y compris le support.
    - Rend le système observable de bout en bout et alerte sur les demandes bloquées.
    - Propose la solution simple avant toute architecture sophistiquée, et dit ce qui le ferait changer.
    - Prépare l'ouverture (test de charge, procédure d'incident) et nomme les risques.
signaux:
  - Calculs absents ou faits en silence.
  - Génération synchrone dans la requête HTTP.
  - Retries sans limite qui aggravent la panne du service de signature.
  - Aucun mot sur ce que voit l'usager pendant l'attente ou en cas d'échec.
  - Event sourcing ou microservices proposés d'emblée, sans justification.
concepts:
  [
    idempotence,
    rate-limiting,
    timeout,
    circuit-breaker,
    retry-backoff,
    outbox,
    webhook,
    tracing-distribue,
  ]
---

## Réponse modèle

**Récapitulatif chiffré.** 100 000 demandes en deux heures, soit environ 14 par seconde,
sous la limite de 50 du service de signature. Avec 20 secondes par attestation, la loi de
Little donne environ 280 traitements simultanés. Vingt secondes ne tiennent pas dans une
requête HTTP : le traitement est asynchrone.

**Parcours.** L'application valide la demande, l'enregistre en base, publie un message, et
répond aussitôt avec un numéro horodaté et une page de suivi. L'usager n'attend pas
devant un écran figé.

**Traitement.** Des workers consomment la file, avec une **limitation de débit partagée**
vers le service de signature, pour ne jamais dépasser son quota quel que soit le nombre de
workers.

**Fiabilité.** Le transport est durable, mais **la base reste la source de vérité** : la
file n'est qu'un transport, et une tâche de rattrapage republie les demandes restées en
attente. Chaque demande porte une **clé d'idempotence** : un triple clic ne produit
qu'une attestation.

**Panne du service de signature.** Timeout court et **disjoncteur**. Quand le circuit est
ouvert, les messages sont remis en file avec un délai, sans compter de tentative ; la file
d'échecs est réservée aux vraies erreurs. L'usager ne voit qu'un délai, pas une erreur.

**Support.** Un historique horodaté des étapes de chaque demande, les webhooks du
prestataire d'envoi d'e-mails pour savoir si l'attestation est partie, une relance
idempotente en un clic, un identifiant de corrélation dans tous les logs.

**Observabilité.** Profondeur de la file, débit vers le service de signature, état du
disjoncteur, et une alerte sur les demandes bloquées depuis plus de trente minutes.

## Ce qui fait la différence

Poser les calculs à voix haute, justifier chaque choix, penser à l'usager et au support,
et proposer la solution simple avant toute architecture sophistiquée.
