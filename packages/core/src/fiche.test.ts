import { describe, expect, it } from "vitest";
import { ficheDeSeance } from "./fiche";
import type { Flashcard } from "./flashcard";
import { evaluer } from "./score";

const niveaux = [
  { id: "confirme", libelle: "Confirmé" },
  { id: "senior", libelle: "Senior" },
];

const carte = (id: string, concepts: [string, string, string]): Flashcard => ({
  id,
  situation: `Situation ${id}`,
  categorie: "c",
  arbre: [
    {
      mot: "racine",
      synonymes: [],
      pourquoi: "parce que",
      concept: concepts[0],
      alternatives: [],
      enfants: [
        {
          mot: "couche",
          synonymes: [],
          concept: concepts[1],
          alternatives: [],
          enfants: [],
        },
      ],
    },
    {
      mot: "autre",
      synonymes: [],
      concept: concepts[2],
      alternatives: [],
      enfants: [],
    },
  ],
});

const resultat = (c: Flashcard, cites: string[]) => ({
  carte: c,
  evaluation: evaluer(c.arbre, new Set(cites), niveaux),
});

describe("fiche de séance", () => {
  it("liste ce qui manquait, et ce qui était cité sans son parent", () => {
    const c = carte("a", ["x", "y", "z"]);
    const fiche = ficheDeSeance([resultat(c, ["0.0"])]);
    expect(fiche.questions[0]?.elements).toEqual([
      {
        chemin: "0",
        mot: "racine",
        pourquoi: "parce que",
        concept: "x",
        statut: "manquant",
      },
      {
        chemin: "0.0",
        mot: "couche",
        pourquoi: undefined,
        concept: "y",
        statut: "orphelin",
      },
      {
        chemin: "1",
        mot: "autre",
        pourquoi: undefined,
        concept: "z",
        statut: "manquant",
      },
    ]);
  });

  it("n'a rien à revoir pour une réponse complète", () => {
    const c = carte("a", ["x", "y", "z"]);
    const fiche = ficheDeSeance([resultat(c, ["0", "0.0", "1"])]);
    expect(fiche.questions[0]?.elements).toEqual([]);
    expect(fiche.concepts).toEqual([]);
  });

  it("classe les concepts par nombre de questions où ils manquaient", () => {
    const fiche = ficheDeSeance([
      resultat(carte("a", ["x", "y", "z"]), ["0", "0.0"]),
      resultat(carte("b", ["w", "y", "z"]), ["0"]),
      // Deux éléments du même concept dans une question ne comptent qu'une fois.
      resultat(carte("c", ["v", "z", "z"]), ["0"]),
    ]);
    expect(fiche.concepts).toEqual([
      { concept: "z", questions: 3 },
      { concept: "y", questions: 1 },
    ]);
  });
});
