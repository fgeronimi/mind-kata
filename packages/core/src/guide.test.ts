import { describe, expect, it } from "vitest";
import { schemaGuide } from "./guide";

const misEnPlace = {
  id: "mise-en-place",
  titre: "La mise en place",
  resume: "Tout préparer avant le service pour ne rien chercher pendant.",
  ordre: 1,
};

describe("schemaGuide", () => {
  it("accepte un guide complet", () => {
    expect(schemaGuide.safeParse(misEnPlace).success).toBe(true);
  });

  it("refuse un ordre qui n'est pas un entier positif", () => {
    expect(schemaGuide.safeParse({ ...misEnPlace, ordre: 0 }).success).toBe(
      false,
    );
    expect(schemaGuide.safeParse({ ...misEnPlace, ordre: 1.5 }).success).toBe(
      false,
    );
  });

  it("exige un résumé", () => {
    const { resume: _, ...sansResume } = misEnPlace;
    expect(schemaGuide.safeParse(sansResume).success).toBe(false);
  });
});
