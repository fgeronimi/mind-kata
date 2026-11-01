import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  codeValide,
  creerJeton,
  DUREE_SESSION_MS,
  jetonValide,
  normaliserCode,
} from "./jeton";

const empreinteDe = (code: string) =>
  createHash("sha256").update(code).digest("hex");

describe("code d'accès", () => {
  const empreinte = empreinteDe("abcd2345efgh6789");

  it("accepte le code tel qu'affiché, en groupes et en majuscules", () => {
    expect(normaliserCode(" ABCD-2345 efgh-6789 ")).toBe("abcd2345efgh6789");
    expect(codeValide("ABCD-2345-EFGH-6789", empreinte)).toBe(true);
  });

  it("refuse un autre code", () => {
    expect(codeValide("abcd2345efgh6788", empreinte)).toBe(false);
  });

  it("refuse tout si l'empreinte n'est pas configurée", () => {
    expect(codeValide("", "")).toBe(false);
    expect(codeValide("abcd2345efgh6789", "")).toBe(false);
  });
});

describe("jeton de session", () => {
  const cle = "cle-de-test";
  const maintenant = 1_800_000_000_000;

  it("est valide jusqu'à son expiration", () => {
    const jeton = creerJeton(cle, maintenant);
    expect(jetonValide(jeton, cle, maintenant)).toBe(true);
    expect(jetonValide(jeton, cle, maintenant + DUREE_SESSION_MS - 1)).toBe(
      true,
    );
    expect(jetonValide(jeton, cle, maintenant + DUREE_SESSION_MS)).toBe(false);
  });

  it("est révoqué par un changement de clé", () => {
    expect(
      jetonValide(creerJeton(cle, maintenant), "autre-cle", maintenant),
    ).toBe(false);
  });

  it("refuse une expiration repoussée à la main", () => {
    const [, signature] = creerJeton(cle, maintenant).split(".");
    const falsifie = `${String(maintenant + 10 * DUREE_SESSION_MS)}.${String(signature)}`;
    expect(jetonValide(falsifie, cle, maintenant)).toBe(false);
  });

  it.each([
    undefined,
    "",
    "abc",
    "1.2.3",
    "nan.signature",
    `${String(maintenant + 1)}.`,
  ])("refuse un jeton mal formé : %s", (jeton) => {
    expect(jetonValide(jeton, cle, maintenant)).toBe(false);
  });

  it("refuse tout si la clé n'est pas configurée", () => {
    expect(jetonValide(creerJeton("", maintenant), "", maintenant)).toBe(false);
  });
});
