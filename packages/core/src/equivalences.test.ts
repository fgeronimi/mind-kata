import { describe, expect, it } from "vitest";
import { schemaEquivalences } from "./equivalences";

const couteaux = {
  titre: "Couteaux",
  description: "Le bon couteau selon le geste.",
  colonnes: [
    { id: "francais", libelle: "Cuisine française" },
    { id: "japonais", libelle: "Cuisine japonaise" },
  ],
  lignes: [
    {
      besoin: "Émincer",
      valeurs: { francais: "Couteau de chef", japonais: "Gyuto" },
    },
  ],
};

describe("schemaEquivalences", () => {
  it("accepte un tableau complet", () => {
    expect(schemaEquivalences.safeParse(couteaux).success).toBe(true);
  });

  it("signale une case manquante avec son chemin", () => {
    const resultat = schemaEquivalences.safeParse({
      ...couteaux,
      lignes: [{ besoin: "Désosser", valeurs: { francais: "Désosseur" } }],
    });
    expect(resultat.error?.issues[0]?.path).toEqual([
      "lignes",
      0,
      "valeurs",
      "japonais",
    ]);
  });

  it("refuse une colonne non déclarée", () => {
    const resultat = schemaEquivalences.safeParse({
      ...couteaux,
      lignes: [
        {
          besoin: "Émincer",
          valeurs: { francais: "Chef", japonais: "Gyuto", chinois: "Cai dao" },
        },
      ],
    });
    expect(resultat.error?.issues[0]?.message).toBe(
      "colonne « chinois » non déclarée",
    );
  });
});
