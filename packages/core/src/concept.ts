import { z } from "zod";
import { identifiant, texte } from "./commun";
import { type Domaine, enumCategories, enumNiveaux } from "./domaine";

// Le schéma dépend du domaine : les catégories et les niveaux autorisés sont ceux que
// le pack déclare, rien n'est figé dans le moteur.
export const schemaConcept = (domaine: Domaine) =>
  z.object({
    id: identifiant,
    terme: texte,
    alias: z.array(texte).default([]),
    categorie: enumCategories(domaine),
    liens: z.array(identifiant).default([]),
    // z.record sur un enum est exhaustif : un niveau manquant est une erreur.
    niveaux: z.record(enumNiveaux(domaine), texte),
  });

export type Concept = z.infer<ReturnType<typeof schemaConcept>> & {
  corps: string;
};
