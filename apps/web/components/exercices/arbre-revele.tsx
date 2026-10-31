"use client";

import type { Chemin, Evaluation, Noeud } from "@mind-kata/core/evaluation";

interface Props {
  arbre: Noeud[];
  cites: ReadonlySet<Chemin>;
  evaluation: Evaluation;
  libellesNiveaux: Record<string, string>;
  onBasculer: (chemin: Chemin) => void;
}

type Etat = "trouve" | "orphelin" | "manquant";

const styles: Record<Etat, { bordure: string; libelle: string }> = {
  trouve: { bordure: "border-l-green-600", libelle: "trouvé" },
  orphelin: {
    bordure: "border-l-amber-500",
    libelle: "cité sans le nœud parent : ne compte pas",
  },
  manquant: { bordure: "border-l-border", libelle: "manquant" },
};

// Liste indentée plutôt que graphe : lisible au clavier et au lecteur d'écran, et
// suffisante tant que les arbres restent petits (un graphe viendra plus tard).
export function ArbreRevele({
  arbre,
  cites,
  evaluation,
  libellesNiveaux,
  onBasculer,
}: Props) {
  const valides = new Set(evaluation.valides);
  const orphelins = new Set(evaluation.orphelins);
  const etatDe = (chemin: Chemin): Etat =>
    valides.has(chemin)
      ? "trouve"
      : orphelins.has(chemin)
        ? "orphelin"
        : "manquant";

  const rendre = (noeuds: Noeud[], parent?: Chemin) => (
    <ul className={parent === undefined ? "space-y-2" : "mt-2 space-y-2 pl-6"}>
      {noeuds.map((noeud, i) => {
        const chemin =
          parent === undefined ? String(i) : `${parent}.${String(i)}`;
        const etat = etatDe(chemin);
        const id = `noeud-${chemin.replaceAll(".", "-")}`;
        return (
          <li key={chemin}>
            <div
              className={`rounded-md border border-l-4 border-border p-3 ${styles[etat].bordure}`}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <input
                  id={id}
                  type="checkbox"
                  checked={cites.has(chemin)}
                  onChange={() => {
                    onBasculer(chemin);
                  }}
                  className="size-4 accent-accent"
                />
                <label htmlFor={id} className="font-semibold">
                  {noeud.mot}
                </label>
                {noeud.niveau && (
                  <span className="rounded bg-black/5 px-1.5 py-0.5 text-xs dark:bg-white/10">
                    {libellesNiveaux[noeud.niveau] ?? noeud.niveau}
                  </span>
                )}
                <span className="text-xs text-muted">
                  {styles[etat].libelle}
                </span>
              </div>
              {noeud.pourquoi && (
                <p className="mt-1 text-sm text-muted">{noeud.pourquoi}</p>
              )}
              {noeud.alternatives.map((a) => (
                <p key={a.mot} className="mt-1 text-sm">
                  ou <strong>{a.mot}</strong> si {a.condition}
                </p>
              ))}
            </div>
            {noeud.enfants.length > 0 && rendre(noeud.enfants, chemin)}
          </li>
        );
      })}
    </ul>
  );

  return rendre(arbre);
}
