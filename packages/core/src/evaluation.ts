// Point d'entrée pour le navigateur : uniquement des fonctions pures. Le point
// d'entrée principal réexporte le chargeur, qui lit le disque (node:fs) et ne doit
// jamais finir dans un composant client.
export type { Domaine } from "./domaine";
export type { Flashcard, Noeud } from "./flashcard";
export { normaliser } from "./normalisation";
export { reperer } from "./rapprochement";
export {
  type Chemin,
  type Couche,
  type Evaluation,
  evaluer,
  type NoeudParcouru,
  parcourir,
} from "./score";
export { cibleDeRelance } from "./relance";
export { type Verdict, verdict } from "./verdict";
export {
  type ConceptARevoir,
  type ElementARevoir,
  type Fiche,
  ficheDeSeance,
  type QuestionDeFiche,
} from "./fiche";
