"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { LONGUEUR_MAX_LECTURE } from "@/lib/examinateur/limites";

// Ce dont on se sert de la reconnaissance vocale. Le DOM de TypeScript décrit ses
// événements, pas l'objet lui-même (préfixé webkit dans Chrome et Safari).
interface Reconnaissance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((evenement: SpeechRecognitionEvent) => void) | null;
  onerror: ((evenement: Event & { error?: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

type ConstructeurReconnaissance = new () => Reconnaissance;

const constructeur = (): ConstructeurReconnaissance | undefined => {
  const fenetre = window as unknown as {
    SpeechRecognition?: ConstructeurReconnaissance;
    webkitSpeechRecognition?: ConstructeurReconnaissance;
  };
  return fenetre.SpeechRecognition ?? fenetre.webkitSpeechRecognition;
};

// Calculé côté navigateur seulement : au rendu serveur, aucune API vocale n'existe et
// les boutons restent cachés, sans écart d'hydratation.
const useDisponible = (test: () => boolean): boolean =>
  useSyncExternalStore(
    () => () => undefined,
    test,
    () => false,
  );

// Dictée en « appuyer pour parler » : démarrer, parler, arrêter. Le texte reconnu
// s'ajoute à ce qui est déjà saisi, et reste modifiable avant l'envoi.
export const useDictee = (surTexte: (texte: string) => void) => {
  const disponible = useDisponible(() => constructeur() !== undefined);
  const [ecoute, setEcoute] = useState(false);
  const [erreur, setErreur] = useState<string>();
  const reconnaissance = useRef<Reconnaissance | null>(null);
  const rappel = useRef(surTexte);
  useEffect(() => {
    rappel.current = surTexte;
  }, [surTexte]);

  const arreter = useCallback(() => {
    reconnaissance.current?.stop();
  }, []);

  const demarrer = useCallback((dejaSaisi: string) => {
    const Constructeur = constructeur();
    if (!Constructeur || reconnaissance.current) return;
    const r = new Constructeur();
    r.lang = "fr-FR";
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (evenement) => {
      // Les résultats couvrent toute la session de dictée : on reconstruit le texte
      // entier à chaque événement, provisoires compris, plutôt que d'ajouter.
      const dicte = Array.from(evenement.results)
        .map((resultat) => resultat[0]?.transcript ?? "")
        .join("")
        .trim();
      rappel.current([dejaSaisi, dicte].filter(Boolean).join(" "));
    };
    r.onerror = (evenement) => {
      setErreur(
        evenement.error === "not-allowed"
          ? "Le micro est refusé : autorisez-le dans le navigateur."
          : "La reconnaissance vocale s'est interrompue.",
      );
    };
    r.onend = () => {
      reconnaissance.current = null;
      setEcoute(false);
    };
    setErreur(undefined);
    reconnaissance.current = r;
    setEcoute(true);
    r.start();
  }, []);

  useEffect(() => arreter, [arreter]);

  return { disponible, ecoute, erreur, demarrer, arreter };
};

const CLE_LECTURE = "mind-kata:lecture-a-voix-haute";

// Préférence gardée dans le navigateur, avec une copie en mémoire : sans stockage
// (navigation privée, stockage bloqué), elle vaut au moins pour la page.
let preferenceEnMemoire = false;
const abonnes = new Set<() => void>();

const lirePreference = (): boolean => {
  try {
    const valeur = window.localStorage.getItem(CLE_LECTURE);
    return valeur === null ? preferenceEnMemoire : valeur === "oui";
  } catch {
    return preferenceEnMemoire;
  }
};

const ecrirePreference = (active: boolean) => {
  preferenceEnMemoire = active;
  try {
    window.localStorage.setItem(CLE_LECTURE, active ? "oui" : "non");
  } catch {
    // La copie en mémoire suffit.
  }
  abonnes.forEach((prevenir) => {
    prevenir();
  });
};

const sAbonner = (prevenir: () => void) => {
  abonnes.add(prevenir);
  return () => {
    abonnes.delete(prevenir);
  };
};

// Voix du navigateur : gratuite et locale, mais robotique. Elle ne sert plus que de
// repli quand la voix du serveur n'est pas disponible (ADR 0011).
const lireParLeNavigateur = (texte: string) => {
  if (!("speechSynthesis" in window)) return;
  const enonce = new SpeechSynthesisUtterance(texte);
  enonce.lang = "fr-FR";
  const voix = window.speechSynthesis
    .getVoices()
    .find((v) => v.lang.startsWith("fr"));
  if (voix) enonce.voice = voix;
  window.speechSynthesis.speak(enonce);
};

// Quota atteint ou panne : inutile de redemander à chaque bulle, la page reste sur la
// voix du navigateur jusqu'au prochain chargement.
let serveurIndisponible = false;

// Lecture à voix haute : l'audio est synthétisé par le serveur, puis joué ici.
export const useLecture = () => {
  const disponible = useDisponible(() => typeof Audio !== "undefined");
  const active = useSyncExternalStore(sAbonner, lirePreference, () => false);
  const enCours = useRef<{
    audio?: HTMLAudioElement;
    abandon: AbortController;
  }>(undefined);

  const arreter = useCallback(() => {
    if (enCours.current) {
      const { abandon, audio } = enCours.current;
      abandon.abort();
      if (audio) {
        audio.pause();
        URL.revokeObjectURL(audio.src);
      }
      enCours.current = undefined;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const basculer = useCallback(() => {
    if (lirePreference()) arreter();
    ecrirePreference(!lirePreference());
  }, [arreter]);

  const lire = useCallback(
    (texte: string) => {
      if (!active) return;
      // Une nouvelle bulle coupe la précédente : on n'empile pas les lectures.
      arreter();
      if (serveurIndisponible || texte.length > LONGUEUR_MAX_LECTURE) {
        lireParLeNavigateur(texte);
        return;
      }
      const lecture: { audio?: HTMLAudioElement; abandon: AbortController } = {
        abandon: new AbortController(),
      };
      enCours.current = lecture;
      void (async () => {
        try {
          const reponse = await fetch("/api/examinateur/voix", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texte }),
            signal: lecture.abandon.signal,
          });
          if (!reponse.ok) {
            if (reponse.status !== 401) serveurIndisponible = true;
            throw new Error(`Synthèse refusée (${String(reponse.status)}).`);
          }
          const url = URL.createObjectURL(await reponse.blob());
          if (lecture.abandon.signal.aborted) {
            URL.revokeObjectURL(url);
            return;
          }
          lecture.audio = new Audio(url);
          lecture.audio.addEventListener("ended", () => {
            URL.revokeObjectURL(url);
          });
          await lecture.audio.play();
        } catch {
          // Arrêtée exprès (nouvelle bulle, dictée) : rien à lire. Sinon, la voix du
          // navigateur prend le relais.
          if (!lecture.abandon.signal.aborted) lireParLeNavigateur(texte);
        }
      })();
    },
    [active, arreter],
  );

  useEffect(() => arreter, [arreter]);

  return { disponible, active, basculer, lire, arreter };
};
