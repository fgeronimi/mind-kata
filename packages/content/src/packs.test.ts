import { chargerPack } from "@mind-kata/core";
import { describe, expect, it } from "vitest";
import { cheminDuPack, domainesDisponibles } from "./index";

// Ce test est la barrière de la CI : un fichier de contenu invalide, un niveau
// manquant ou un lien cassé fait échouer make check, avec la liste des erreurs.
describe.each(domainesDisponibles())("pack %s", (domaine) => {
  it("est valide", () => {
    expect(() => chargerPack(cheminDuPack(domaine))).not.toThrow();
  });
});

it("contient au moins un pack", () => {
  expect(domainesDisponibles()).not.toEqual([]);
});
