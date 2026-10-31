import { describe, expect, it } from "vitest";
import { schemaFlashcard } from "./flashcard";
import { reperer } from "./rapprochement";
import { domaineCuisine } from "./test/domaine-cuisine";

// émulsion
// └── température (alternative : bain-marie)
//     └── rattrapage au jaune frais
// cuisson
const { arbre } = schemaFlashcard(domaineCuisine).parse({
  id: "sauce-qui-tranche",
  situation: "Une hollandaise tranche au moment du service.",
  categorie: "sauces",
  arbre: [
    {
      mot: "émulsion",
      synonymes: ["liaison"],
      enfants: [
        {
          mot: "température",
          alternatives: [
            { mot: "bain-marie", condition: "si le feu est trop vif" },
          ],
          enfants: [{ mot: "rattrapage au jaune frais" }],
        },
      ],
    },
    { mot: "cuisson" },
  ],
});

const trouves = (reponse: string) => [...reperer(arbre, reponse)].sort();

describe("reperer", () => {
  it("retrouve les mots sans tenir compte de la casse ni des accents", () => {
    expect(
      trouves("L'EMULSION a cassé, la Température était trop haute"),
    ).toEqual(["0", "0.0"]);
  });

  it("reconnaît un synonyme", () => {
    expect(trouves("la liaison n'a pas tenu")).toEqual(["0"]);
  });

  it("reconnaît une alternative comme une réponse au nœud", () => {
    expect(trouves("je passe au bain marie")).toEqual(["0.0"]);
  });

  it("reconnaît une expression de plusieurs mots, même mise en forme autrement", () => {
    expect(trouves("Rattrapage au jaune  frais !")).toEqual(["0.0.0"]);
  });

  it("ne trouve pas un mot à l'intérieur d'un autre", () => {
    expect(trouves("les cuissons du jour")).toEqual([]);
  });

  it("ne trouve rien dans une réponse vide", () => {
    expect(trouves("")).toEqual([]);
  });
});
