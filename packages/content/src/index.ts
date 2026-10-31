import { readdirSync, existsSync } from "node:fs";
import path from "node:path";

// Les packs vivent à la racine du paquet, un dossier par domaine. Une fois ce code
// empaqueté par Next, import.meta.dirname n'existe plus : on repart alors du dossier
// courant, qui est celui de l'application web au build comme à l'exécution.
const racine = import.meta.dirname
  ? path.join(import.meta.dirname, "..")
  : path.join(process.cwd(), "../../packages/content");

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
