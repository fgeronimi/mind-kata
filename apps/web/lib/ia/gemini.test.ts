import { describe, expect, it } from "vitest";
import { consommationDe } from "./gemini";

const requete = { systeme: "x".repeat(30), messages: [], maxJetonsSortie: 400 };

describe("consommation Gemini", () => {
  it("compte la réflexion comme de la sortie", () => {
    expect(
      consommationDe(
        {
          promptTokenCount: 94,
          candidatesTokenCount: 18,
          thoughtsTokenCount: 5,
        },
        requete,
      ),
    ).toEqual({ jetonsEntree: 94, jetonsSortie: 23 });
  });

  it("retient le majorant quand les compteurs manquent", () => {
    expect(consommationDe(undefined, requete)).toEqual({
      jetonsEntree: 10,
      jetonsSortie: 400,
    });
  });
});
