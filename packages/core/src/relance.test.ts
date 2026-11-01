import { describe, expect, it } from "vitest";
import type { Domaine } from "./domaine";
import type { Flashcard } from "./flashcard";
import { cibleDeRelance } from "./relance";
import { evaluer } from "./score";

const niveaux: Domaine["niveaux"] = [
  { id: "confirme", libelle: "Confirmé" },
  { id: "senior", libelle: "Senior" },
];

const carte: Flashcard = {
  id: "ruee",
  situation: "Une clé de cache très demandée expire.",
  categorie: "cache",
  arbre: [
    {
      mot: "cache stampede",
      synonymes: ["thundering herd"],
      pourquoi: "nommer le phénomène",
      niveau: "confirme",
      alternatives: [],
      enfants: [
        {
          mot: "verrou",
          synonymes: ["mutex"],
          niveau: "senior",
          alternatives: [
            { mot: "single flight", synonymes: [], condition: "en Go" },
          ],
          enfants: [],
        },
      ],
    },
  ],
};

describe("cible de relance", () => {
  it("vise la racine manquante avant la couche suivante", () => {
    const evaluation = evaluer(carte.arbre, new Set(), niveaux);
    expect(cibleDeRelance(carte.arbre, evaluation)?.chemin).toBe("0");
  });

  it("vise l'enfant manquant une fois le parent acquis", () => {
    const evaluation = evaluer(carte.arbre, new Set(["0"]), niveaux);
    expect(cibleDeRelance(carte.arbre, evaluation)?.chemin).toBe("0.0");
  });

  it("vise le parent d'un orphelin, pas l'orphelin", () => {
    const evaluation = evaluer(carte.arbre, new Set(["0.0"]), niveaux);
    expect(cibleDeRelance(carte.arbre, evaluation)?.chemin).toBe("0");
  });

  it("ne vise rien quand tout est trouvé", () => {
    const evaluation = evaluer(carte.arbre, new Set(["0", "0.0"]), niveaux);
    expect(cibleDeRelance(carte.arbre, evaluation)).toBeUndefined();
  });
});
