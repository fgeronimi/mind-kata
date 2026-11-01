import { describe, expect, it } from "vitest";
import { verdict } from "./verdict";

const niveaux = [
  { id: "confirme", libelle: "Confirmé" },
  { id: "senior", libelle: "Senior" },
  { id: "lead", libelle: "Lead" },
];

describe("verdict de séance", () => {
  it("retient le niveau atteint ou dépassé sur au moins la moitié des questions", () => {
    const atteints = [
      "lead",
      "senior",
      "senior",
      undefined,
      "confirme",
      undefined,
    ];
    expect(verdict(atteints, niveaux)).toEqual({
      niveau: "senior",
      repartition: [
        { niveau: "confirme", questions: 4 },
        { niveau: "senior", questions: 3 },
        { niveau: "lead", questions: 1 },
      ],
    });
  });

  it("ne donne pas de niveau pour une seule bonne réponse", () => {
    expect(
      verdict(["lead", undefined, undefined], niveaux).niveau,
    ).toBeUndefined();
  });

  it("ne donne pas de niveau sans question", () => {
    expect(verdict([], niveaux).niveau).toBeUndefined();
  });

  it("ignore un niveau inconnu du domaine", () => {
    expect(verdict(["expert", "expert"], niveaux).niveau).toBeUndefined();
  });
});
