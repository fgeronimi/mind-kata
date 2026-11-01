import type { Domaine, Flashcard } from "@mind-kata/core/evaluation";
import { describe, expect, it } from "vitest";
import { creerModeleFaux } from "@/lib/ia/faux";
import type { Message } from "@/lib/ia/modele";
import { construireRequete, jouerTour, ReponseIllisible } from "./tour";

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

const reponse = (texte: string): Message[] => [{ role: "candidat", texte }];
const json = (cites: string[], relance = "") =>
  JSON.stringify({ cites, relance });

describe("requête de l'examinateur", () => {
  it("décrit l'arbre avec ses identifiants, synonymes et alternatives", () => {
    const { systeme, schemaJson } = construireRequete(carte, reponse("…"), 2);
    expect(systeme).toContain(
      "[0] cache stampede (aussi : thundering herd) — nommer le phénomène",
    );
    expect(systeme).toContain("  [0.0] verrou (aussi : mutex)");
    expect(systeme).toContain(
      "ou « single flight » si en Go : vaut pour [0.0]",
    );
    expect(systeme).toContain("Relances restantes : 2.");
    expect(schemaJson).toBeDefined();
  });
});

describe("tour de l'examinateur", () => {
  it("calcule le score par le code à partir des éléments rattachés", async () => {
    const modele = creerModeleFaux({ reponses: [json(["0", "0.0"])] });
    const tour = await jouerTour(
      modele,
      carte,
      reponse("stampede et verrou"),
      niveaux,
    );
    expect(tour.cites).toEqual(["0", "0.0"]);
    expect(tour.evaluation).toMatchObject({
      points: 2,
      maximum: 2,
      niveauAtteint: "senior",
    });
    expect(tour.relance).toBeUndefined();
  });

  it("relance quand il manque des éléments et qu'il reste des relances", async () => {
    const modele = creerModeleFaux({
      reponses: [json(["0"], " Et pour éviter le recalcul simultané ? ")],
    });
    const tour = await jouerTour(modele, carte, reponse("stampede"), niveaux);
    expect(tour.relance).toBe("Et pour éviter le recalcul simultané ?");
  });

  it("ne relance plus après la deuxième relance", async () => {
    const echanges: Message[] = [
      { role: "candidat", texte: "a" },
      { role: "examinateur", texte: "?" },
      { role: "candidat", texte: "b" },
      { role: "examinateur", texte: "?" },
      { role: "candidat", texte: "c" },
    ];
    const modele = creerModeleFaux({ reponses: [json(["0"], "Encore ?")] });
    const tour = await jouerTour(modele, carte, echanges, niveaux);
    expect(tour.relance).toBeUndefined();
    expect(modele.requetes[0]?.systeme).toContain("Relances restantes : 0.");
  });

  it("ignore les identifiants inventés et les doublons", async () => {
    const modele = creerModeleFaux({
      reponses: [json(["0", "0", "7.3", "0.0.1"])],
    });
    const tour = await jouerTour(modele, carte, reponse("…"), niveaux);
    expect(tour.cites).toEqual(["0"]);
  });

  it("applique la règle du parent : un enfant sans son parent ne compte pas", async () => {
    const modele = creerModeleFaux({ reponses: [json(["0.0"])] });
    const tour = await jouerTour(modele, carte, reponse("un verrou"), niveaux);
    expect(tour.evaluation.points).toBe(0);
    expect(tour.evaluation.orphelins).toEqual(["0.0"]);
  });

  it.each([
    "pas du json",
    JSON.stringify({ cites: "0" }),
    JSON.stringify({ relance: "" }),
  ])("signale une réponse illisible : %s", async (texte) => {
    const modele = creerModeleFaux({ reponses: [texte] });
    await expect(
      jouerTour(modele, carte, reponse("…"), niveaux),
    ).rejects.toBeInstanceOf(ReponseIllisible);
  });
});
