"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

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

// Lecture à voix haute par la synthèse du navigateur, gratuite et locale.
export const useLecture = () => {
  const disponible = useDisponible(() => "speechSynthesis" in window);
  const active = useSyncExternalStore(sAbonner, lirePreference, () => false);

  const arreter = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const basculer = useCallback(() => {
    if (lirePreference()) window.speechSynthesis.cancel();
    ecrirePreference(!lirePreference());
  }, []);

  const lire = useCallback(
    (texte: string) => {
      if (!active || !("speechSynthesis" in window)) return;
      const enonce = new SpeechSynthesisUtterance(texte);
      enonce.lang = "fr-FR";
      const voix = window.speechSynthesis
        .getVoices()
        .find((v) => v.lang.startsWith("fr"));
      if (voix) enonce.voice = voix;
      // Une nouvelle bulle coupe la précédente : on n'empile pas les lectures.
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(enonce);
    },
    [active],
  );

  return { disponible, active, basculer, lire, arreter };
};
