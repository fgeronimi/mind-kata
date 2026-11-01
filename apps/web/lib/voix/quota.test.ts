import { describe, expect, it } from "vitest";
import type { Plafonds } from "@/lib/ia/budget";
import { creerCompteurMemoire } from "@/lib/ia/compteur-memoire";
import { avecQuota, QuotaVoixEpuise } from "./quota";
import type { Synthese } from "./synthese";

const plafonds: Plafonds = {
  coutParJour: 10,
  appelsParJour: 100,
  coutParMois: 100,
};
const le1erNovembre = () => new Date("2026-11-01T10:00:00Z");
const periodes = { mois: "2026-11", jour: "01" };
const audio = new Uint8Array([1, 2, 3]);
const fidele: Synthese = {
  id: "fidele",
  synthetiser: () => Promise.resolve(audio),
};

describe("quota de synthèse vocale", () => {
  it("compte les caractères lus", async () => {
    const compteur = creerCompteurMemoire();
    const synthese = avecQuota(fidele, compteur, plafonds, le1erNovembre);
    expect(await synthese.synthetiser("abcd")).toBe(audio);
    expect(compteur.totaux(periodes)).toEqual({
      coutMois: 4,
      coutJour: 4,
      appelsJour: 1,
    });
  });

  it("refuse sans appeler le prestataire une fois le plafond atteint", async () => {
    let appels = 0;
    const synthese = avecQuota(
      {
        id: "compte",
        synthetiser: () => {
          appels++;
          return Promise.resolve(audio);
        },
      },
      creerCompteurMemoire(),
      plafonds,
      le1erNovembre,
    );
    await synthese.synthetiser("x".repeat(8));
    await expect(synthese.synthetiser("xxx")).rejects.toBeInstanceOf(
      QuotaVoixEpuise,
    );
    expect(appels).toBe(1);
  });

  it("rend les caractères d'un appel en échec", async () => {
    const compteur = creerCompteurMemoire();
    const synthese = avecQuota(
      { id: "panne", synthetiser: () => Promise.reject(new Error("panne")) },
      compteur,
      plafonds,
      le1erNovembre,
    );
    await expect(synthese.synthetiser("abcd")).rejects.toThrow("panne");
    expect(compteur.totaux(periodes)).toEqual({
      coutMois: 0,
      coutJour: 0,
      appelsJour: 1,
    });
  });
});
