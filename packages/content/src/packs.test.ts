import { chargerPack, parcourir, reperer } from "@mind-kata/core";
import { describe, expect, it } from "vitest";
import { cheminDuPack, domainesDisponibles } from "./index";

// Ce test est la barrière de la CI : un fichier de contenu invalide, un niveau
// manquant ou un lien cassé fait échouer make check, avec la liste des erreurs.
describe.each(domainesDisponibles())("pack %s", (domaine) => {
  it("est valide", () => {
    expect(() => chargerPack(cheminDuPack(domaine))).not.toThrow();
  });

  it("a des arbres dont chaque nœud est reconnu par son propre mot", () => {
    const { flashcards } = chargerPack(cheminDuPack(domaine));
    const introuvables = flashcards.flatMap((carte) =>
      parcourir(carte.arbre)
        .filter(
          ({ chemin, noeud }) => !reperer(carte.arbre, noeud.mot).has(chemin),
        )
        .map(({ noeud }) => `${carte.id} : « ${noeud.mot} »`),
    );
    expect(introuvables).toEqual([]);
  });
});

it("contient au moins un pack", () => {
  expect(domainesDisponibles()).not.toEqual([]);
});
