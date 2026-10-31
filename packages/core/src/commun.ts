import { z } from "zod";

// Les identifiants servent d'URL et de références entre fichiers : on les veut stables,
// lisibles et sans ambiguïté de casse ou d'accent.
export const identifiant = z
  .string()
  .regex(
    /^[a-z0-9]+(-[a-z0-9]+)*$/,
    "identifiant attendu en kebab-case, sans accent",
  );

export const texte = z.string().trim().min(1, "texte vide");
