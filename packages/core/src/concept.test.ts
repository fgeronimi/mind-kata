import { describe, expect, it } from "vitest";
import { schemaConcept } from "./concept";
import { domaineCuisine } from "./test/domaine-cuisine";

const schema = schemaConcept(domaineCuisine);

const roux = {
  id: "roux",
  terme: "Roux",
  categorie: "sauces",
  liens: ["bechamel"],
  niveaux: {
    commis: "Sait le réaliser à parts égales de beurre et de farine.",
    "chef-de-partie":
      "Adapte la cuisson (blanc, blond, brun) à la sauce visée.",
    chef: "Arbitre entre roux et liaisons sans gluten selon la carte.",
  },
};

describe("schemaConcept", () => {
  it("accepte un concept dont les niveaux sont ceux du domaine", () => {
    const concept = schema.parse(roux);
    expect(concept.alias).toEqual([]);
  });

  it("refuse une catégorie que le domaine ne déclare pas", () => {
    expect(schema.safeParse({ ...roux, categorie: "patisserie" }).success).toBe(
      false,
    );
  });

  it("exige tous les niveaux du domaine", () => {
    const { chef: _, ...niveauxIncomplets } = roux.niveaux;
    const resultat = schema.safeParse({ ...roux, niveaux: niveauxIncomplets });
    expect(resultat.error?.issues[0]?.path).toEqual(["niveaux", "chef"]);
  });

  it("refuse un niveau que le domaine ne déclare pas", () => {
    const resultat = schema.safeParse({
      ...roux,
      niveaux: { ...roux.niveaux, apprenti: "Regarde faire." },
    });
    expect(resultat.success).toBe(false);
  });

  it("refuse un lien qui n'est pas un identifiant", () => {
    expect(schema.safeParse({ ...roux, liens: ["Béchamel"] }).success).toBe(
      false,
    );
  });
});
