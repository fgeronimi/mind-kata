import { describe, expect, it } from "vitest";
import { avecBudget, BudgetEpuise, periodesDe, type Plafonds } from "./budget";
import { creerCompteurMemoire } from "./compteur-memoire";
import { cout, coutMaximal } from "./cout";
import { creerModeleFaux } from "./faux";
import type { Requete } from "./modele";

const requete: Requete = {
  systeme: "x".repeat(300),
  messages: [{ role: "candidat", texte: "y".repeat(300) }],
  maxJetonsSortie: 100,
};
const tarif = { entreeParMillion: 1, sortieParMillion: 2 };
// 600 caractères, soit au plus 200 jetons d'entrée, et 100 de sortie au plus.
const reserve = 200 * 1 + 100 * 2;
const consommation = { jetonsEntree: 150, jetonsSortie: 40 };
const reel = 150 * 1 + 40 * 2;

const large: Plafonds = {
  coutParJour: 1_000_000,
  appelsParJour: 100,
  coutParMois: 1_000_000,
};
const le1erNovembre = () => new Date("2026-11-01T10:00:00Z");
const periodes = { mois: "2026-11", jour: "01" };

describe("coût", () => {
  it("compte en micro-dollars entiers, arrondis au-dessus", () => {
    expect(
      cout(
        { entreeParMillion: 0.25, sortieParMillion: 1.5 },
        { jetonsEntree: 3, jetonsSortie: 3 },
      ),
    ).toBe(1 + 5);
  });

  it("majore avant l'appel à partir des caractères et du plafond de sortie", () => {
    expect(coutMaximal(tarif, requete)).toBe(reserve);
  });
});

describe("périodes", () => {
  it("suivent l'heure de Paris, pas UTC", () => {
    // 23 h 30 UTC le 31 octobre : déjà le 1er novembre à Paris.
    expect(periodesDe(new Date("2026-10-31T23:30:00Z"))).toEqual(periodes);
    expect(periodesDe(new Date("2026-11-01T22:59:00Z"))).toEqual(periodes);
    expect(periodesDe(new Date("2026-11-01T23:00:00Z"))).toEqual({
      mois: "2026-11",
      jour: "02",
    });
  });
});

describe("modèle avec budget", () => {
  it("laisse passer l'appel et compte le coût réel, pas la réservation", async () => {
    const compteur = creerCompteurMemoire();
    const modele = avecBudget(
      creerModeleFaux({ reponses: ["ok"], tarif, consommation }),
      compteur,
      large,
      le1erNovembre,
    );

    await expect(modele.repondre(requete)).resolves.toMatchObject({
      texte: "ok",
    });
    expect(compteur.totaux(periodes)).toEqual({
      coutMois: reel,
      coutJour: reel,
      appelsJour: 1,
    });
  });

  it("refuse l'appel qui pourrait franchir le plafond du jour, sans appeler le modèle", async () => {
    const compteur = creerCompteurMemoire();
    const faux = creerModeleFaux({ reponses: () => "ok", tarif, consommation });
    // Après un appel (230), il reste 170 : moins que la réservation de 400.
    const modele = avecBudget(
      faux,
      compteur,
      { ...large, coutParJour: reel + reserve - 1 },
      le1erNovembre,
    );

    await modele.repondre(requete);
    await expect(modele.repondre(requete)).rejects.toBeInstanceOf(BudgetEpuise);
    expect(faux.requetes).toHaveLength(1);
  });

  it("applique le plafond du mois et le nombre d'appels par jour", async () => {
    const faux = creerModeleFaux({ reponses: () => "ok", tarif, consommation });
    const parMois = avecBudget(
      faux,
      creerCompteurMemoire(),
      { ...large, coutParMois: reserve - 1 },
      le1erNovembre,
    );
    await expect(parMois.repondre(requete)).rejects.toBeInstanceOf(
      BudgetEpuise,
    );

    const parAppels = avecBudget(
      faux,
      creerCompteurMemoire(),
      { ...large, appelsParJour: 2 },
      le1erNovembre,
    );
    await parAppels.repondre(requete);
    await parAppels.repondre(requete);
    await expect(parAppels.repondre(requete)).rejects.toBeInstanceOf(
      BudgetEpuise,
    );
  });

  it("rend la réservation quand le modèle échoue, mais compte l'appel", async () => {
    const compteur = creerCompteurMemoire();
    const enPanne = {
      id: "panne",
      tarif,
      repondre: () => Promise.reject(new Error("réseau")),
    };
    const modele = avecBudget(enPanne, compteur, large, le1erNovembre);

    await expect(modele.repondre(requete)).rejects.toThrow("réseau");
    expect(compteur.totaux(periodes)).toEqual({
      coutMois: 0,
      coutJour: 0,
      appelsJour: 1,
    });
  });

  it("garde le même contrat que le modèle décoré", async () => {
    const morceaux: string[] = [];
    const modele = avecBudget(
      creerModeleFaux({ reponses: ["bonjour"], tarif }),
      creerCompteurMemoire(),
      large,
    );
    await modele.repondre(requete, { surTexte: (m) => morceaux.push(m) });
    expect(modele.id).toBe("faux/modele");
    expect(morceaux).toEqual(["bonjour"]);
  });
});
