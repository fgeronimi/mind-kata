import type { Domaine } from "./domaine";
import type { Noeud } from "./flashcard";

// Un nœud est désigné par son chemin dans l'arbre : "0" pour la première racine,
// "0.1" pour son deuxième enfant. Le contenu n'a pas à porter d'identifiants.
export type Chemin = string;

export interface NoeudParcouru {
  chemin: Chemin;
  parent: Chemin | undefined;
  profondeur: number;
  noeud: Noeud;
}

export const parcourir = (arbre: Noeud[]): NoeudParcouru[] => {
  const resultat: NoeudParcouru[] = [];
  const visiter = (
    noeuds: Noeud[],
    parent: Chemin | undefined,
    profondeur: number,
  ) => {
    noeuds.forEach((noeud, i) => {
      const chemin =
        parent === undefined ? String(i) : `${parent}.${String(i)}`;
      resultat.push({ chemin, parent, profondeur, noeud });
      visiter(noeud.enfants, chemin, profondeur + 1);
    });
  };
  visiter(arbre, undefined, 0);
  return resultat;
};

export interface Couche {
  profondeur: number;
  trouves: number;
  total: number;
}

export interface Evaluation {
  points: number;
  maximum: number;
  // Cités et rattachés à un parent cité (ou racines) : ce sont eux qui comptent.
  valides: Chemin[];
  // Cités sans leur parent : le mot est là, le raisonnement qui y mène ne l'est pas.
  orphelins: Chemin[];
  manquants: Chemin[];
  couches: Couche[];
  // Le plus exigeant des niveaux portés par les nœuds valides, dans l'ordre du domaine.
  niveauAtteint: string | undefined;
}

// Calcul déterministe : même arbre et mêmes nœuds cités donnent toujours le même
// résultat. C'est ce qui rend le score reproductible et explicable (ADR 0005).
export const evaluer = (
  arbre: Noeud[],
  cites: ReadonlySet<Chemin>,
  niveaux: Domaine["niveaux"],
): Evaluation => {
  const noeuds = parcourir(arbre);
  // Un nœud compte s'il est cité et que son parent compte lui-même : la chaîne doit
  // remonter sans trou jusqu'à la racine. Le parcours visite les parents avant leurs
  // enfants, la validité du parent est donc toujours déjà connue.
  const validite = new Map<Chemin, boolean>();
  for (const n of noeuds) {
    const parentValide =
      n.parent === undefined || validite.get(n.parent) === true;
    validite.set(n.chemin, cites.has(n.chemin) && parentValide);
  }
  const estValide = (n: NoeudParcouru) => validite.get(n.chemin) === true;

  const valides = noeuds.filter(estValide);
  const orphelins = noeuds.filter((n) => cites.has(n.chemin) && !estValide(n));
  const manquants = noeuds.filter((n) => !cites.has(n.chemin));

  const profondeurMax = Math.max(...noeuds.map((n) => n.profondeur));
  const couches: Couche[] = Array.from(
    { length: profondeurMax + 1 },
    (_, profondeur) => {
      const couche = noeuds.filter((n) => n.profondeur === profondeur);
      return {
        profondeur,
        trouves: couche.filter(estValide).length,
        total: couche.length,
      };
    },
  );

  const rangs = new Map(niveaux.map((n, rang) => [n.id, rang]));
  const niveauAtteint = valides
    .map((n) => n.noeud.niveau)
    .filter((niveau) => niveau !== undefined)
    .sort((a, b) => (rangs.get(b) ?? -1) - (rangs.get(a) ?? -1))[0];

  return {
    points: valides.length,
    maximum: noeuds.length,
    valides: valides.map((n) => n.chemin),
    orphelins: orphelins.map((n) => n.chemin),
    manquants: manquants.map((n) => n.chemin),
    couches,
    niveauAtteint,
  };
};
