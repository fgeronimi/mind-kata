import { describe, expect, it } from "vitest";
import { schemaDomaine } from "./domaine";
import { domaineCuisine } from "./test/domaine-cuisine";

const valide = { ...domaineCuisine };

describe("schemaDomaine", () => {
  it("accepte un domaine complet", () => {
    expect(schemaDomaine.safeParse(valide).success).toBe(true);
  });

  it("refuse deux niveaux avec le même identifiant", () => {
    const resultat = schemaDomaine.safeParse({
      ...valide,
      niveaux: [
        { id: "chef", libelle: "Chef" },
        { id: "chef", libelle: "Chef bis" },
      ],
    });
    expect(resultat.error?.issues[0]?.message).toBe(
      "deux niveaux ont le même identifiant",
    );
  });

  it("refuse un domaine sans catégorie", () => {
    expect(schemaDomaine.safeParse({ ...valide, categories: [] }).success).toBe(
      false,
    );
  });

  it("refuse un identifiant qui n'est pas en kebab-case", () => {
    expect(
      schemaDomaine.safeParse({ ...valide, id: "Cuisine Française" }).success,
    ).toBe(false);
  });

  it("refuse un type de contenu inconnu", () => {
    expect(
      schemaDomaine.safeParse({ ...valide, types: ["podcast"] }).success,
    ).toBe(false);
  });
});
