import { z } from "zod";
import { identifiant, texte } from "./commun";

const libelle = z.strictObject({
  id: identifiant,
  libelle: texte,
  description: texte.optional(),
});

const sansDoublon = (elements: { id: string }[]) =>
  new Set(elements.map((e) => e.id)).size === elements.length;

export const typesDeContenu = [
  "concept",
  "architecture",
  "guide",
  "simulation",
  "equivalences",
  "flashcard",
] as const;

export const schemaDomaine = z.strictObject({
  id: identifiant,
  nom: texte,
  langue: z
    .string()
    .regex(/^[a-z]{2}$/, "code langue ISO 639-1 attendu (fr, en…)"),
  description: texte,
  // Du moins au plus exigeant : l'ordre sert à situer une réponse sur l'échelle.
  niveaux: z
    .array(libelle)
    .min(1)
    .refine(sansDoublon, "deux niveaux ont le même identifiant"),
  categories: z
    .array(libelle)
    .min(1)
    .refine(sansDoublon, "deux catégories ont le même identifiant"),
  types: z.array(z.enum(typesDeContenu)).min(1),
});

export type Domaine = z.infer<typeof schemaDomaine>;

// Un z.enum exige au moins une valeur : garanti par le .min(1) du schéma de domaine.
export const enumNiveaux = (domaine: Domaine) =>
  z.enum(domaine.niveaux.map((n) => n.id) as [string, ...string[]]);

export const enumCategories = (domaine: Domaine) =>
  z.enum(domaine.categories.map((c) => c.id) as [string, ...string[]]);
