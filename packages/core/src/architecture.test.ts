import { describe, expect, it } from "vitest";
import { schemaArchitecture } from "./architecture";

const brigade = {
  id: "brigade-de-cuisine",
  titre: "Brigade de cuisine",
  probleme: "Servir cent couverts en même temps sans que les plats attendent",
  briques: [
    "chef qui annonce les bons",
    "postes spécialisés (sauces, poissons, garnitures)",
    "passe où les assiettes sont vérifiées",
  ],
  concepts: ["mise-en-place", "envoi"],
};

describe("schemaArchitecture", () => {
  it("accepte une architecture complète", () => {
    expect(schemaArchitecture.safeParse(brigade).success).toBe(true);
  });

  it("met une liste vide quand aucun concept n'est cité", () => {
    const { concepts: _, ...sansConcepts } = brigade;
    expect(schemaArchitecture.parse(sansConcepts).concepts).toEqual([]);
  });

  it("refuse une architecture sans brique", () => {
    const resultat = schemaArchitecture.safeParse({ ...brigade, briques: [] });
    expect(resultat.error?.issues[0]?.message).toBe(
      "une architecture a au moins une brique",
    );
  });

  it("refuse un identifiant qui n'est pas en kebab-case", () => {
    expect(
      schemaArchitecture.safeParse({ ...brigade, id: "Brigade de cuisine" })
        .success,
    ).toBe(false);
  });

  it("refuse un concept cité qui n'est pas un identifiant", () => {
    expect(
      schemaArchitecture.safeParse({ ...brigade, concepts: ["Mise en place"] })
        .success,
    ).toBe(false);
  });

  it("refuse un champ inconnu, pour qu'une faute de frappe ne passe pas inaperçue", () => {
    const { concepts, ...reste } = brigade;
    const resultat = schemaArchitecture.safeParse({
      ...reste,
      concept: concepts,
    });
    expect(resultat.error?.issues[0]?.code).toBe("unrecognized_keys");
  });
});
