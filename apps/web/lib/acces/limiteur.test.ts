import { describe, expect, it } from "vitest";
import { creerLimiteur } from "./limiteur";

describe("limiteur de tentatives", () => {
  const fenetreMs = 1000;

  it("bloque après le nombre d'échecs permis, dans la fenêtre", () => {
    const limiteur = creerLimiteur({ tentatives: 2, fenetreMs });
    expect(limiteur.bloque("ip", 0)).toBe(false);
    limiteur.echec("ip", 0);
    expect(limiteur.bloque("ip", 10)).toBe(false);
    limiteur.echec("ip", 10);
    expect(limiteur.bloque("ip", 20)).toBe(true);
  });

  it("libère quand les échecs sortent de la fenêtre", () => {
    const limiteur = creerLimiteur({ tentatives: 1, fenetreMs });
    limiteur.echec("ip", 0);
    expect(limiteur.bloque("ip", 999)).toBe(true);
    expect(limiteur.bloque("ip", 1000)).toBe(false);
  });

  it("compte chaque origine séparément", () => {
    const limiteur = creerLimiteur({ tentatives: 1, fenetreMs });
    limiteur.echec("a", 0);
    expect(limiteur.bloque("a", 1)).toBe(true);
    expect(limiteur.bloque("b", 1)).toBe(false);
  });
});
