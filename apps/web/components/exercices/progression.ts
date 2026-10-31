// Progression gardée dans le navigateur, en attendant les comptes (lot 3). Le stockage
// peut être indisponible (navigation privée, stockage bloqué) : l'entraînement doit
// alors fonctionner quand même, simplement sans mémoire.
export type Resultat = "su" | "a-revoir";

export interface Trace {
  resultat: Resultat;
  points: number;
  maximum: number;
  date: string;
}

export type Progression = Record<string, Trace>;

const cle = (domaine: string) => `mind-kata:progression:${domaine}`;

export const lireProgression = (domaine: string): Progression => {
  try {
    const brut = window.localStorage.getItem(cle(domaine));
    return brut ? (JSON.parse(brut) as Progression) : {};
  } catch {
    return {};
  }
};

export const enregistrer = (domaine: string, carte: string, trace: Trace) => {
  try {
    const progression = lireProgression(domaine);
    progression[carte] = trace;
    window.localStorage.setItem(cle(domaine), JSON.stringify(progression));
  } catch {
    // Stockage indisponible : la série continue, seule la mémoire est perdue.
  }
};
