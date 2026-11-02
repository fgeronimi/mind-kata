import type { Fiche } from "@mind-kata/core/evaluation";

interface Props {
  fiche: Fiche;
  domaine: string;
  termes: Record<string, string>;
  libelle: (niveau: string | undefined) => string;
}

// Nouvel onglet : la séance ne vit que dans cette page, la quitter la perdrait.
function LienConcept({
  domaine,
  id,
  terme,
}: {
  domaine: string;
  id: string;
  terme: string;
}) {
  return (
    <a
      href={`/${domaine}/concepts/${id}`}
      target="_blank"
      rel="noopener"
      className="text-accent underline-offset-2 hover:underline print:text-inherit"
    >
      {terme}
    </a>
  );
}

// Ce qu'il reste à travailler, pensé pour être imprimé : rien n'y est replié.
export function FicheDeSeance({ fiche, domaine, termes, libelle }: Props) {
  const terme = (id: string) => termes[id] ?? id;
  return (
    <>
      {fiche.concepts.length > 0 && (
        <section aria-labelledby="titre-a-revoir" className="mt-8">
          <h2
            id="titre-a-revoir"
            className="break-after-avoid text-xl font-semibold"
          >
            À revoir en priorité
          </h2>
          <ul className="mt-3 space-y-1">
            {fiche.concepts.map(({ concept, questions }) => (
              <li key={concept}>
                <LienConcept
                  domaine={domaine}
                  id={concept}
                  terme={terme(concept)}
                />
                <span className="text-sm text-muted">
                  {" "}
                  · manquait sur {questions} question{questions > 1 ? "s" : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section aria-labelledby="titre-par-question" className="mt-8">
        <h2
          id="titre-par-question"
          className="break-after-avoid text-xl font-semibold"
        >
          Question par question
        </h2>
        <ol className="mt-3 space-y-6">
          {fiche.questions.map(({ carte, evaluation, elements }) => (
            <li key={carte.id} className="break-inside-avoid">
              <p className="font-semibold">{carte.situation}</p>
              <p className="text-sm text-muted">
                {evaluation.points} / {evaluation.maximum} · niveau{" "}
                {libelle(evaluation.niveauAtteint)}
              </p>
              {elements.length === 0 ? (
                <p className="mt-2 text-sm">Réponse complète.</p>
              ) : (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {elements.map((e) => (
                    <li key={e.chemin}>
                      <span className="font-medium">{e.mot}</span>
                      {e.statut === "orphelin" && (
                        <span className="text-muted">
                          {" "}
                          (cité, sans ce qui y mène)
                        </span>
                      )}
                      {e.pourquoi && <span> : {e.pourquoi}</span>}
                      {e.concept && (
                        <>
                          {" "}
                          ·{" "}
                          <LienConcept
                            domaine={domaine}
                            id={e.concept}
                            terme={terme(e.concept)}
                          />
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
