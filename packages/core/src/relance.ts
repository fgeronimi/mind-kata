import type { Noeud } from "./flashcard";
import { type Evaluation, type NoeudParcouru, parcourir } from "./score";

// La relance vise un élément choisi par le code, pas par le modèle : le plus proche de
// la racine parmi ceux qui manquent et dont le parent est acquis. C'est la couche
// suivante du raisonnement, celle que le candidat peut atteindre.
export const cibleDeRelance = (
  arbre: Noeud[],
  evaluation: Evaluation,
): NoeudParcouru | undefined => {
  const valides = new Set(evaluation.valides);
  return parcourir(arbre)
    .filter(
      (n) =>
        !valides.has(n.chemin) &&
        (n.parent === undefined || valides.has(n.parent)),
    )
    .sort((a, b) => a.profondeur - b.profondeur)[0];
};
