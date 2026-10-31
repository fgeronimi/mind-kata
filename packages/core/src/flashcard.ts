import { z } from "zod";
import { identifiant, texte } from "./commun";
import { type Domaine, enumCategories, enumNiveaux } from "./domaine";

// Une réponse attendue est un arbre : un nœud ne vaut quelque chose que si son parent
// a été cité, d'où la structure récursive plutôt qu'une liste de mots-clés.
export const schemaFlashcard = (domaine: Domaine) => {
  const alternative = z.object({
    mot: texte,
    synonymes: z.array(texte).default([]),
    condition: texte,
  });

  const noeud = z.object({
    mot: texte,
    synonymes: z.array(texte).default([]),
    pourquoi: texte.optional(),
    niveau: enumNiveaux(domaine).optional(),
    concept: identifiant.optional(),
    alternatives: z.array(alternative).default([]),
    // Getter : syntaxe de Zod 4 pour un schéma qui se référence lui-même.
    get enfants() {
      return z.array(noeud).default([]);
    },
  });

  return z.object({
    id: identifiant,
    situation: texte,
    categorie: enumCategories(domaine),
    arbre: z.array(noeud).min(1, "un arbre a au moins un nœud racine"),
  });
};

export type Flashcard = z.infer<ReturnType<typeof schemaFlashcard>>;
export type Noeud = Flashcard["arbre"][number];
