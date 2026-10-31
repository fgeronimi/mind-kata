import { describe, expect, it } from "vitest";
import { schemaFlashcard } from "./flashcard";
import { evaluer, parcourir } from "./score";
import { domaineCuisine } from "./test/domaine-cuisine";

// émulsion (commis)
// ├── température (chef-de-partie)
// │   └── rattrapage au jaune frais (chef)
// └── fouet
// beurre clarifié
const { arbre } = schemaFlashcard(domaineCuisine).parse({
  id: "sauce-qui-tranche",
  situation: "Une hollandaise tranche au moment du service.",
  categorie: "sauces",
  arbre: [
    {
      mot: "émulsion",
      niveau: "commis",
      enfants: [
        {
          mot: "température",
          niveau: "chef-de-partie",
          enfants: [{ mot: "rattrapage au jaune frais", niveau: "chef" }],
        },
        { mot: "fouet" },
      ],
    },
    { mot: "beurre clarifié" },
  ],
});

const niveaux = domaineCuisine.niveaux;
const evaluerAvec = (...cites: string[]) =>
  evaluer(arbre, new Set(cites), niveaux);

describe("parcourir", () => {
  it("donne à chaque nœud un chemin, parents avant enfants", () => {
    expect(parcourir(arbre).map((n) => n.chemin)).toEqual([
      "0",
      "0.0",
      "0.0.0",
      "0.1",
      "1",
    ]);
  });
});

describe("evaluer", () => {
  it("donne tous les points quand tout est cité", () => {
    const e = evaluerAvec("0", "0.0", "0.0.0", "0.1", "1");
    expect(e.points).toBe(5);
    expect(e.maximum).toBe(5);
    expect(e.orphelins).toEqual([]);
    expect(e.manquants).toEqual([]);
  });

  it("ne compte pas un nœud cité sans son parent, et le signale", () => {
    const e = evaluerAvec("0.0");
    expect(e.points).toBe(0);
    expect(e.orphelins).toEqual(["0.0"]);
  });

  it("exige une chaîne continue jusqu'à la racine", () => {
    // « température » et « rattrapage » sans « émulsion » : rien ne compte.
    const e = evaluerAvec("0.0", "0.0.0");
    expect(e.valides).toEqual([]);
    expect(e.orphelins).toEqual(["0.0", "0.0.0"]);
  });

  it("compte chaque racine indépendamment", () => {
    expect(evaluerAvec("1").valides).toEqual(["1"]);
  });

  it("détaille les nœuds trouvés couche par couche", () => {
    expect(evaluerAvec("0", "0.1", "1").couches).toEqual([
      { profondeur: 0, trouves: 2, total: 2 },
      { profondeur: 1, trouves: 1, total: 2 },
      { profondeur: 2, trouves: 0, total: 1 },
    ]);
  });

  it("indique le niveau le plus exigeant atteint, dans l'ordre du domaine", () => {
    expect(evaluerAvec("0").niveauAtteint).toBe("commis");
    expect(evaluerAvec("0", "0.0").niveauAtteint).toBe("chef-de-partie");
    expect(evaluerAvec("0", "0.0", "0.0.0").niveauAtteint).toBe("chef");
  });

  it("n'attribue aucun niveau quand rien ne compte", () => {
    expect(evaluerAvec("0.0.0").niveauAtteint).toBeUndefined();
  });

  it("ignore un orphelin pour le niveau atteint", () => {
    // Citer un terme de chef sans le raisonnement qui y mène ne fait pas un chef.
    expect(evaluerAvec("0", "0.0.0").niveauAtteint).toBe("commis");
  });
});
