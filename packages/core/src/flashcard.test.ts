import { describe, expect, it } from "vitest";
import { schemaFlashcard } from "./flashcard";
import { domaineCuisine } from "./test/domaine-cuisine";

const schema = schemaFlashcard(domaineCuisine);

const sauceQuiTranche = {
  id: "sauce-qui-tranche",
  situation: "Une hollandaise tranche au moment du service.",
  categorie: "sauces",
  arbre: [
    {
      mot: "émulsion",
      pourquoi: "comprendre ce qui s'est rompu",
      niveau: "commis",
      enfants: [
        {
          mot: "température",
          synonymes: ["chaleur"],
          pourquoi: "le jaune cuit au-delà de 65 °C",
          niveau: "chef-de-partie",
          alternatives: [
            { mot: "bain-marie", condition: "si le feu est trop vif" },
          ],
          enfants: [{ mot: "rattrapage au jaune frais" }],
        },
      ],
    },
  ],
};

describe("schemaFlashcard", () => {
  it("accepte un arbre sur plusieurs profondeurs", () => {
    const carte = schema.parse(sauceQuiTranche);
    const petitEnfant = carte.arbre[0]?.enfants[0]?.enfants[0];
    expect(petitEnfant?.mot).toBe("rattrapage au jaune frais");
    expect(petitEnfant?.enfants).toEqual([]);
  });

  it("refuse un arbre vide", () => {
    expect(schema.safeParse({ ...sauceQuiTranche, arbre: [] }).success).toBe(
      false,
    );
  });

  it("refuse un niveau inconnu au fond de l'arbre", () => {
    const arbre = structuredClone(sauceQuiTranche.arbre);
    arbre[0]!.enfants[0]!.enfants[0] = {
      mot: "rattrapage",
      niveau: "apprenti",
    } as never;
    const resultat = schema.safeParse({ ...sauceQuiTranche, arbre });
    expect(resultat.error?.issues[0]?.path).toEqual([
      "arbre",
      0,
      "enfants",
      0,
      "enfants",
      0,
      "niveau",
    ]);
  });

  it("exige une condition pour chaque alternative", () => {
    const arbre = structuredClone(sauceQuiTranche.arbre);
    arbre[0]!.enfants[0]!.alternatives = [{ mot: "bain-marie" }] as never;
    expect(schema.safeParse({ ...sauceQuiTranche, arbre }).success).toBe(false);
  });
});
