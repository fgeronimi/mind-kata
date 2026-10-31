import { z } from "zod";
import { identifiant, texte } from "./commun";

// Un tableau comparatif : un besoin par ligne, une solution par colonne.
export const schemaEquivalences = z
  .strictObject({
    titre: texte,
    description: texte,
    colonnes: z
      .array(z.strictObject({ id: identifiant, libelle: texte }))
      .min(2, "une comparaison a au moins deux colonnes"),
    lignes: z
      .array(
        z.strictObject({
          besoin: texte,
          valeurs: z.record(identifiant, texte),
        }),
      )
      .min(1),
    notes: z.array(texte).default([]),
  })
  .superRefine((tableau, ctx) => {
    const attendues = tableau.colonnes.map((c) => c.id);
    tableau.lignes.forEach((ligne, i) => {
      const presentes = Object.keys(ligne.valeurs);
      for (const id of attendues.filter((a) => !presentes.includes(a))) {
        ctx.addIssue({
          code: "custom",
          path: ["lignes", i, "valeurs", id],
          message: `valeur manquante pour la colonne « ${id} »`,
        });
      }
      for (const id of presentes.filter((p) => !attendues.includes(p))) {
        ctx.addIssue({
          code: "custom",
          path: ["lignes", i, "valeurs", id],
          message: `colonne « ${id} » non déclarée`,
        });
      }
    });
  });

export type Equivalences = z.infer<typeof schemaEquivalences> & { id: string };
