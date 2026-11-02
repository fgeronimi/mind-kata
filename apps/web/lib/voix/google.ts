import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import type { Synthese } from "./synthese";

// Voix Chirp 3 HD : la plus naturelle du catalogue, et la seule gamme avec un million
// de caractères gratuits par mois qui ne sonne pas comme un GPS.
export const VOIX_PAR_DEFAUT = "fr-FR-Chirp3-HD-Despina";

// Au-delà, le navigateur bascule sur sa propre voix : mieux vaut lire tout de suite
// avec une voix moins belle que faire attendre.
const DELAI_MS = 10_000;

export const creerSyntheseGoogle = ({
  voix = VOIX_PAR_DEFAUT,
}: { voix?: string } = {}): Synthese => {
  const client = new TextToSpeechClient();
  return {
    id: voix,
    async synthetiser(texte) {
      const [reponse] = await client.synthesizeSpeech(
        {
          input: { text: texte },
          voice: { languageCode: voix.slice(0, 5), name: voix },
          audioConfig: { audioEncoding: "MP3" },
        },
        { timeout: DELAI_MS },
      );
      const audio = reponse.audioContent;
      if (!audio || typeof audio === "string") {
        throw new Error("Réponse de synthèse sans audio.");
      }
      // Le client renvoie un Buffer de Node, qui peut partager sa mémoire avec
      // d'autres : une copie est un corps de réponse valide.
      return new Uint8Array(audio);
    },
  };
};
