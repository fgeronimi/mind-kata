import { z } from "zod";
import { identifiant, texte } from "./commun";

export const schemaArchitecture = z.strictObject({
  id: identifiant,
  titre: texte,
  probleme: texte,
  briques: z.array(texte).min(1, "une architecture a au moins une brique"),
  concepts: z.array(identifiant).default([]),
});

// Le corps Markdown (dont le schéma Mermaid) ne vient pas de l'en-tête YAML : il est
// ajouté par le chargeur.
export type Architecture = z.infer<typeof schemaArchitecture> & {
  corps: string;
};
