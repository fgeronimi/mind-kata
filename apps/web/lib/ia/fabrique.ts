import "server-only";

import { Firestore } from "@google-cloud/firestore";
import { avecBudget } from "./budget";
import { creerCompteurFirestore } from "./compteur-firestore";
import { creerCompteurMemoire } from "./compteur-memoire";
import { creerModeleFaux } from "./faux";
import { creerModeleGemini, GEMINI_3_1_FLASH_LITE } from "./gemini";
import type { ModeleIA } from "./modele";

export class IaNonConfiguree extends Error {
  constructor() {
    super("Aucun fournisseur d'IA configuré (IA_FOURNISSEUR).");
    this.name = "IaNonConfiguree";
  }
}

// Le seul endroit qui connaît le fournisseur : changer de modèle, c'est ajouter un cas
// ici et changer la variable d'environnement. Le budget s'applique quel qu'il soit.
const creer = (): ModeleIA => {
  const projet = process.env["GOOGLE_CLOUD_PROJECT"] ?? "";
  switch (process.env["IA_FOURNISSEUR"]) {
    case "vertex-gemini":
      return avecBudget(
        creerModeleGemini({ projet, ...GEMINI_3_1_FLASH_LITE }),
        // REST plutôt que gRPC : démarrage plus rapide, ce qui compte sur Cloud Run
        // où une instance démarre à la première requête.
        creerCompteurFirestore(
          new Firestore({ projectId: projet, preferRest: true }),
        ),
      );
    // Pour Playwright : déterministe et gratuit. Première réponse relancée, la
    // suivante rattachée à la racine ; « panne » simule un fournisseur en échec.
    case "faux":
      return avecBudget(
        creerModeleFaux({
          reponses: ({ messages }) => {
            if (messages.some((m) => m.texte.includes("panne"))) {
              throw new Error("Panne simulée.");
            }
            return JSON.stringify(
              messages.length === 1
                ? { cites: [], relance: "Pouvez-vous préciser ?" }
                : { cites: ["0"], relance: "" },
            );
          },
        }),
        creerCompteurMemoire(),
      );
    default:
      throw new IaNonConfiguree();
  }
};

// Un seul client par instance : il garde ses connexions ouvertes d'une requête à
// l'autre.
let modele: ModeleIA | undefined;

export const modeleExaminateur = (): ModeleIA => {
  modele ??= creer();
  return modele;
};
