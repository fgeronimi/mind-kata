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
        // gRPC, le transport par défaut : c'est celui que le test de contrat vérifie
        // contre l'émulateur, qui n'accepte pas REST sans identifiants.
        creerCompteurFirestore(new Firestore({ projectId: projet })),
      );
    // Pour Playwright : déterministe et gratuit. La première réponse n'est rattachée à
    // rien, donc relancée ; la suivante est rattachée à tout l'arbre (identifiants lus
    // dans le prompt). « panne » simule un fournisseur en échec.
    case "faux":
      return avecBudget(
        creerModeleFaux({
          reponses: ({ systeme, messages, schemaJson }) => {
            if (messages.some((m) => m.texte.includes("panne"))) {
              throw new Error("Panne simulée.");
            }
            if (!schemaJson) return "Pouvez-vous préciser ?";
            const tous = [...systeme.matchAll(/\[([\d.]+)\]/g)].map(
              (m) => m[1],
            );
            return JSON.stringify({ cites: messages.length === 1 ? [] : tous });
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
