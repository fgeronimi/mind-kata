import { z } from "zod";
import { identifiant, texte } from "./commun";

// Un guide est une fiche transverse (méthode, repères chiffrés, arbitrages) : ni un
// concept ni une architecture, mais ce qui relie les deux.
export const schemaGuide = z.strictObject({
  id: identifiant,
  titre: texte,
  resume: texte,
  // Position dans la liste des guides : la méthode se lit avant les arbitrages.
  ordre: z.number().int().positive(),
});

export type Guide = z.infer<typeof schemaGuide> & { corps: string };
