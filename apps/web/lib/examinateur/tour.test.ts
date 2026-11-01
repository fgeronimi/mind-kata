import {
  type Domaine,
  evaluer,
  type Flashcard,
} from "@mind-kata/core/evaluation";
import { describe, expect, it } from "vitest";
import { creerModeleFaux } from "@/lib/ia/faux";
import type { Message, Requete } from "@/lib/ia/modele";
import {
  cibleDeRelance,
  construireRattachement,
  construireRelance,
  jouerTour,
  ReponseIllisible,
} from "./tour";

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

// Le faux distingue les deux appels : rattachement (JSON imposé) et relance (texte).
const modele = (cites: string[], relance = "Et pendant le recalcul ?") =>
  creerModeleFaux({
    reponses: (r: Requete) =>
      r.schemaJson ? JSON.stringify({ cites }) : relance,
  });

describe("requêtes de l'examinateur", () => {
  it("le rattachement décrit l'arbre et accepte un parent exprimé sans son mot", () => {
    const { systeme, schemaJson } = construireRattachement(carte, reponse("…"));
    expect(systeme).toContain(
      "[0] cache stampede (aussi : thundering herd) — nommer le phénomène",
    );
    expect(systeme).toContain("  [0.0] verrou (aussi : mutex)");
    expect(systeme).toContain(
      "ou « single flight » si en Go : vaut pour [0.0]",
    );
    expect(systeme).toContain("si le candidat en décrit clairement l'idée");
    expect(schemaJson).toBeDefined();
  });

  it("la relance vise un élément sans montrer l'arbre", () => {
    const cible = carte.arbre[0]?.enfants[0];
    if (!cible) throw new Error("arbre de test");
    const { systeme, schemaJson } = construireRelance(
      carte,
      reponse("…"),
      cible,
    );
    expect(systeme).toContain("« verrou »");
    expect(systeme).not.toContain("cache stampede");
    expect(schemaJson).toBeUndefined();
  });
});

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

describe("tour de l'examinateur", () => {
  it("calcule le score par le code, sans relancer une réponse complète", async () => {
    const faux = modele(["0", "0.0"]);
    const tour = await jouerTour(
      faux,
      carte,
      reponse("stampede et verrou"),
      niveaux,
    );
    expect(tour.evaluation).toMatchObject({
      points: 2,
      maximum: 2,
      niveauAtteint: "senior",
    });
    expect(tour.relance).toBeUndefined();
    expect(faux.requetes).toHaveLength(1);
  });

  it("relance vers l'élément visé par le code", async () => {
    const faux = modele(
      ["0"],
      " « Et pendant le recalcul, que font les autres requêtes ? » ",
    );
    const tour = await jouerTour(faux, carte, reponse("stampede"), niveaux);
    expect(tour.relance).toBe(
      "Et pendant le recalcul, que font les autres requêtes ?",
    );
    expect(faux.requetes[1]?.systeme).toContain("« verrou »");
  });

  it("écarte une relance qui donne la réponse", async () => {
    const faux = modele(["0"], "Avez-vous pensé à un mutex ?");
    const tour = await jouerTour(faux, carte, reponse("stampede"), niveaux);
    expect(tour.relance).toBeUndefined();
  });

  it("ne relance plus après la deuxième relance, et n'appelle pas le modèle pour rien", async () => {
    const echanges: Message[] = [
      { role: "candidat", texte: "a" },
      { role: "examinateur", texte: "?" },
      { role: "candidat", texte: "b" },
      { role: "examinateur", texte: "?" },
      { role: "candidat", texte: "c" },
    ];
    const faux = modele(["0"]);
    const tour = await jouerTour(faux, carte, echanges, niveaux);
    expect(tour.relance).toBeUndefined();
    expect(faux.requetes).toHaveLength(1);
  });

  it("ignore les identifiants inventés et les doublons", async () => {
    const tour = await jouerTour(
      modele(["0", "0", "7.3", "0.0.1"]),
      carte,
      reponse("…"),
      niveaux,
    );
    expect(tour.cites).toEqual(["0"]);
  });

  it("applique la règle du parent : un enfant sans son parent ne compte pas", async () => {
    const tour = await jouerTour(
      modele(["0.0"]),
      carte,
      reponse("un verrou"),
      niveaux,
    );
    expect(tour.evaluation.points).toBe(0);
    expect(tour.evaluation.orphelins).toEqual(["0.0"]);
  });

  it.each(["pas du json", JSON.stringify({ cites: "0" }), JSON.stringify({})])(
    "signale une réponse illisible : %s",
    async (texte) => {
      const faux = creerModeleFaux({ reponses: [texte] });
      await expect(
        jouerTour(faux, carte, reponse("…"), niveaux),
      ).rejects.toBeInstanceOf(ReponseIllisible);
    },
  );
});
