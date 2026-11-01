import type { Domaine } from "./domaine";

export interface Verdict {
  // Absent quand aucun niveau n'est atteint sur au moins la moitié des questions.
  niveau: string | undefined;
  // Pour chaque niveau du domaine : sur combien de questions il est atteint ou dépassé.
  repartition: { niveau: string; questions: number }[];
}

// Le verdict est calculé, pas demandé à l'IA : le niveau atteint ou dépassé sur au
// moins la moitié des questions. Une seule bonne réponse ne fait pas un niveau, une
// seule mauvaise ne le défait pas, et le résultat s'explique en une phrase.
export const verdict = (
  niveauxAtteints: (string | undefined)[],
  niveaux: Domaine["niveaux"],
): Verdict => {
  const rangs = new Map(niveaux.map((n, rang) => [n.id, rang]));
  const rangDe = (niveau: string | undefined) =>
    niveau === undefined ? -1 : (rangs.get(niveau) ?? -1);
  const repartition = niveaux.map((n, rang) => ({
    niveau: n.id,
    questions: niveauxAtteints.filter((a) => rangDe(a) >= rang).length,
  }));
  const moitie = Math.ceil(niveauxAtteints.length / 2);
  const atteint = repartition.filter(
    (r) => niveauxAtteints.length > 0 && r.questions >= moitie,
  );
  return { niveau: atteint.at(-1)?.niveau, repartition };
};
