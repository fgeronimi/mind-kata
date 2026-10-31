# 0007 — Contenu validé et rendu au build

- Statut : acceptée
- Date : 2026-10-31

## Contexte

Le contenu est un ensemble de fichiers Markdown et YAML (ADR 0003), lu par un moteur
générique (ADR 0004). Il faut le valider, le transformer en pages, et dessiner des
schémas d'architecture, sans base de données et avec un coût d'hébergement nul au repos.

## Options envisagées

1. **Lecture et rendu à chaque requête** : contenu toujours à jour sans rebuild, mais
   chaque visite relit le disque, et une erreur de contenu n'apparaît qu'en production.
2. **MDX** (Markdown compilé en composants) : puissant, mais le contenu devient du code
   exécutable, plus difficile à faire contribuer et à valider.
3. **Validation et rendu au build** : le pack est chargé et validé une fois, les pages
   sont générées en HTML statique.

## Décision

Option 3.

- **Validation** : un chargeur (`packages/core`) lit le pack, valide chaque fichier avec
  son schéma Zod (objets stricts : un champ inconnu est une erreur), vérifie que l'`id`
  est le nom du fichier et que chaque lien pointe vers un concept existant. Toutes les
  erreurs sont remontées d'un coup, en français, au format `fichier : champ — message`.
  Un test charge chaque pack : un contenu invalide fait échouer la CI.
- **Rendu** : les pages sont générées au build (`generateStaticParams`), le Markdown est
  transformé en HTML côté serveur ; aucune bibliothèque de rendu n'est envoyée au
  navigateur.
- **Schémas** : écrits en Mermaid dans le Markdown, dessinés dans le navigateur par un
  composant client qui charge Mermaid à la demande. Tant que le schéma n'est pas dessiné,
  sa source est affichée.

## Conséquences

- Une erreur de contenu est vue dans la PR, jamais en production.
- Pages rapides et sans calcul à la requête ; le coût au repos reste nul.
- Publier du contenu demande un déploiement — c'est le flux prévu (merge, puis
  déploiement automatique).
- Mermaid, seule dépendance lourde côté navigateur, n'est téléchargé que sur les pages
  qui contiennent un schéma.
- Avec Cache Components, une URL inconnue est rendue à l'exécution : les fichiers des
  packs sont embarqués dans l'image, et une page introuvable répond 200 avec `noindex`
  (le prérendu partiel a commencé à être envoyé). Limite acceptée ; un vrai statut 404
  demanderait une vérification dans `proxy.ts`.
