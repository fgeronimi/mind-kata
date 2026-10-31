import { readdirSync, existsSync } from "node:fs";
import path from "node:path";

// Les packs vivent à la racine du paquet, un dossier par domaine.
const racine = path.join(import.meta.dirname, "..");

export const cheminDuPack = (domaine: string) => path.join(racine, domaine);

export const domainesDisponibles = (): string[] =>
  readdirSync(racine, { withFileTypes: true })
    .filter(
      (e) =>
        e.isDirectory() &&
        existsSync(path.join(racine, e.name, "domaine.yaml")),
    )
    .map((e) => e.name)
    .sort();
