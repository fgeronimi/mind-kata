import { Firestore } from "@google-cloud/firestore";
import { describe, expect, it } from "vitest";
import type { Compteur, Plafonds } from "./budget";
import { creerCompteurFirestore } from "./compteur-firestore";
import { creerCompteurMemoire } from "./compteur-memoire";

const plafonds: Plafonds = {
  coutParJour: 300,
  appelsParJour: 100,
  coutParMois: 1000,
};

// Le même contrat pour chaque stockage : l'adaptateur Firestore ne doit pas se
// comporter autrement que celui qu'utilisent les autres tests.
const contrat = (nom: string, nouveau: () => Compteur, delaiMs = 5000) => {
  describe(`compteur ${nom}`, { timeout: delaiMs }, () => {
    // Un mois différent par test : les documents Firestore ne se mélangent pas.
    let numero = 0;
    const periodes = () => ({
      mois: `essai-${String(Date.now())}-${String(numero++)}`,
      jour: "01",
    });

    it("accepte tant que le plafond tient, puis refuse", async () => {
      const compteur = nouveau();
      const p = periodes();
      expect(await compteur.reserver(p, 200, plafonds)).toBe(true);
      expect(await compteur.reserver(p, 100, plafonds)).toBe(true);
      expect(await compteur.reserver(p, 1, plafonds)).toBe(false);
    });

    it("libère ce qu'une correction rend", async () => {
      const compteur = nouveau();
      const p = periodes();
      await compteur.reserver(p, 300, plafonds);
      await compteur.corriger(p, -250);
      expect(await compteur.reserver(p, 250, plafonds)).toBe(true);
    });

    it("sépare les jours, mais cumule le mois", async () => {
      const compteur = nouveau();
      const p = periodes();
      for (const jour of ["01", "02", "03"]) {
        expect(await compteur.reserver({ ...p, jour }, 300, plafonds)).toBe(
          true,
        );
      }
      expect(await compteur.reserver({ ...p, jour: "04" }, 300, plafonds)).toBe(
        false,
      );
    });

    it("ne laisse pas passer deux réservations simultanées au-delà du plafond", async () => {
      const compteur = nouveau();
      const p = periodes();
      const resultats = await Promise.all(
        Array.from({ length: 10 }, () => compteur.reserver(p, 100, plafonds)),
      );
      expect(resultats.filter(Boolean)).toHaveLength(3);
    });
  });
};

contrat("en mémoire", creerCompteurMemoire);

// L'émulateur tourne dans Docker (make test-firestore) : sans lui, ces tests sont
// ignorés plutôt que de toucher la vraie base.
const emulateur = process.env["FIRESTORE_EMULATOR_HOST"];
if (emulateur) {
  const base = new Firestore({ projectId: "demo-mind-kata" });
  contrat("Firestore (émulateur)", () => creerCompteurFirestore(base), 30_000);
} else {
  describe.skip("compteur Firestore (émulateur absent)", () => {
    it("make test-firestore", () => undefined);
  });
}
