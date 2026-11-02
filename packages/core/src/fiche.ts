import type { Flashcard } from "./flashcard";
import { type Chemin, type Evaluation, parcourir } from "./score";

export interface ElementARevoir {
  chemin: Chemin;
  mot: string;
  pourquoi: string | undefined;
  concept: string | undefined;
  // « orphelin » : le mot a été cité, mais pas le raisonnement qui y mène.
  statut: "manquant" | "orphelin";
}

export interface QuestionDeFiche {
  carte: Flashcard;
  evaluation: Evaluation;
  elements: ElementARevoir[];
}

export interface ConceptARevoir {
  concept: string;
  // Le nombre de questions où il manquait : un concept raté plusieurs fois est une
  // lacune, pas un oubli.
  questions: number;
}

export interface Fiche {
  questions: QuestionDeFiche[];
  concepts: ConceptARevoir[];
}

// Ce qu'il reste à travailler après une séance, tiré des seuls résultats : aucune IA,
// la fiche dit exactement ce que le score a compté (ADR 0005).
export const ficheDeSeance = (
  resultats: { carte: Flashcard; evaluation: Evaluation }[],
): Fiche => {
  const questions = resultats.map(({ carte, evaluation }) => {
    const orphelins = new Set(evaluation.orphelins);
    const aRevoir = new Set([...evaluation.manquants, ...orphelins]);
    const elements = parcourir(carte.arbre)
      .filter((n) => aRevoir.has(n.chemin))
      .map((n): ElementARevoir => ({
        chemin: n.chemin,
        mot: n.noeud.mot,
        pourquoi: n.noeud.pourquoi,
        concept: n.noeud.concept,
        statut: orphelins.has(n.chemin) ? "orphelin" : "manquant",
      }));
    return { carte, evaluation, elements };
  });

  // Une Map garde l'ordre d'insertion : à égalité, l'ordre de la séance.
  const parConcept = new Map<string, number>();
  for (const { elements } of questions) {
    const concepts = new Set(elements.map((e) => e.concept));
    for (const concept of concepts) {
      if (concept !== undefined) {
        parConcept.set(concept, (parConcept.get(concept) ?? 0) + 1);
      }
    }
  }
  const concepts = [...parConcept]
    .map(([concept, nombre]) => ({ concept, questions: nombre }))
    .sort((a, b) => b.questions - a.questions);

  return { questions, concepts };
};
