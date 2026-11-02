import "server-only";

import { Firestore } from "@google-cloud/firestore";
import { creerCompteurFirestore } from "@/lib/ia/compteur-firestore";
import { creerSyntheseGoogle } from "./google";
import { avecQuota } from "./quota";
import type { Synthese } from "./synthese";

export class VoixNonConfiguree extends Error {
  constructor() {
    super("Aucune synthèse vocale configurée (VOIX_FOURNISSEUR).");
    this.name = "VoixNonConfiguree";
  }
}

// Sans fournisseur (développement, tests), la route répond « indisponible » et le
// navigateur lit avec sa propre voix.
const creer = (): Synthese => {
  switch (process.env["VOIX_FOURNISSEUR"]) {
    case "google-chirp":
      return avecQuota(
        creerSyntheseGoogle(),
        creerCompteurFirestore(
          new Firestore({ projectId: process.env["GOOGLE_CLOUD_PROJECT"] }),
          "voix",
        ),
      );
    default:
      throw new VoixNonConfiguree();
  }
};

let synthese: Synthese | undefined;

export const syntheseExaminateur = (): Synthese => {
  synthese ??= creer();
  return synthese;
};
