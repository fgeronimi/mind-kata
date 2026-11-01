import {
  type GenerateContentParameters,
  type GenerateContentResponseUsageMetadata,
  GoogleGenAI,
  ThinkingLevel,
} from "@google/genai";
import { jetonsMaximaux } from "./cout";
import type { Consommation, ModeleIA, Requete, Tarif } from "./modele";

// Relevé dans le catalogue de facturation de Google Cloud le 2026-11-01, point
// d'accès « global » (le modèle n'est pas proposé en europe-west1). À revérifier à
// chaque changement de modèle.
export const GEMINI_3_1_FLASH_LITE = {
  modele: "gemini-3.1-flash-lite",
  region: "global",
  tarif: { entreeParMillion: 0.25, sortieParMillion: 1.5 },
} as const;

// Sans compteurs dans la réponse, on retient le majorant plutôt que zéro : mieux vaut
// surestimer la consommation que laisser filer le budget.
export const consommationDe = (
  usage: GenerateContentResponseUsageMetadata | undefined,
  requete: Requete,
): Consommation => {
  if (usage?.promptTokenCount === undefined) return jetonsMaximaux(requete);
  return {
    jetonsEntree: usage.promptTokenCount,
    jetonsSortie:
      (usage.candidatesTokenCount ?? 0) + (usage.thoughtsTokenCount ?? 0),
  };
};

// Sur Cloud Run, le client s'authentifie avec le compte de service du service (ADC) :
// aucune clé. En local, `gcloud auth application-default login`.
export const creerModeleGemini = ({
  projet,
  region,
  modele,
  tarif,
}: {
  projet: string;
  region: string;
  modele: string;
  tarif: Tarif;
}): ModeleIA => {
  const client = new GoogleGenAI({
    vertexai: true,
    project: projet,
    location: region,
  });

  return {
    id: `vertex/${modele}`,
    tarif,
    async repondre(requete, options) {
      const parametres: GenerateContentParameters = {
        model: modele,
        contents: requete.messages.map((m) => ({
          role: m.role === "candidat" ? "user" : "model",
          parts: [{ text: m.texte }],
        })),
        config: {
          systemInstruction: requete.systeme,
          maxOutputTokens: requete.maxJetonsSortie,
          // Réflexion au minimum : facturée comme de la sortie, et inutile pour
          // rattacher une réponse à un arbre ou poser une relance.
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          ...(options?.signal && { abortSignal: options.signal }),
          ...(requete.schemaJson && {
            responseMimeType: "application/json",
            responseJsonSchema: requete.schemaJson,
          }),
        },
      };

      const surTexte = options?.surTexte;
      if (!surTexte) {
        const reponse = await client.models.generateContent(parametres);
        return {
          texte: reponse.text ?? "",
          consommation: consommationDe(reponse.usageMetadata, requete),
        };
      }

      let texte = "";
      let usage: GenerateContentResponseUsageMetadata | undefined;
      for await (const morceau of await client.models.generateContentStream(
        parametres,
      )) {
        const fragment = morceau.text ?? "";
        if (fragment !== "") {
          texte += fragment;
          surTexte(fragment);
        }
        // Les compteurs arrivent avec le dernier morceau.
        usage = morceau.usageMetadata ?? usage;
      }
      return { texte, consommation: consommationDe(usage, requete) };
    },
  };
};
