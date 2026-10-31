import { z } from "zod";
import { identifiant, texte } from "./commun";
import { type Domaine, enumNiveaux } from "./domaine";

// Une simulation d'entretien : ce que l'examinateur annonce, ce qu'il relance, et ce
// qu'il attend à chaque niveau. La réponse modèle est le corps Markdown.
export const schemaSimulation = (domaine: Domaine) =>
  z.strictObject({
    id: identifiant,
    titre: texte,
    enonce: texte,
    chiffres: z
      .array(z.strictObject({ libelle: texte, valeur: texte }))
      .min(1, "une simulation donne au moins un chiffre clé"),
    recap: texte,
    // Dans l'ordre où l'examinateur les pose.
    relances: z.array(texte).min(1, "une simulation a au moins une relance"),
    grille: z.record(
      enumNiveaux(domaine),
      z.array(texte).min(1, "chaque niveau a au moins une attente"),
    ),
    signaux: z.array(texte).default([]),
    concepts: z.array(identifiant).default([]),
  });

export type Simulation = z.infer<ReturnType<typeof schemaSimulation>> & {
  corps: string;
};
