import type { Concept, Domaine } from "@mind-kata/core";
import Link from "next/link";
import { Markdown } from "@/components/markdown";

interface Props {
  domaine: Domaine;
  concept: Concept;
  conceptsLies: { id: string; terme: string }[];
}

export function FicheConcept({ domaine, concept, conceptsLies }: Props) {
  const categorie = domaine.categories.find((c) => c.id === concept.categorie);

  return (
    <article>
      <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
        <Link href={`/${domaine.id}`} className="hover:text-accent">
          {domaine.nom}
        </Link>
        {categorie && <span> › {categorie.libelle}</span>}
      </nav>

      <h1 className="mt-2 text-3xl font-semibold">{concept.terme}</h1>
      {concept.alias.length > 0 && (
        <p className="mt-1 text-sm text-muted">
          aussi : {concept.alias.join(", ")}
        </p>
      )}

      <section aria-labelledby="attentes" className="mt-8">
        <h2 id="attentes" className="sr-only">
          Ce qui est attendu à chaque niveau
        </h2>
        {/* Ordre du pack, du moins au plus exigeant, et non celui des clés du fichier. */}
        <dl className="divide-y divide-border rounded-lg border border-border">
          {domaine.niveaux.map((niveau) => {
            const attente = concept.niveaux[niveau.id];
            // Le schéma garantit chaque niveau ; on n'affiche jamais un niveau vide.
            if (!attente) return null;
            return (
              <div key={niveau.id} className="p-4 sm:flex sm:gap-6">
                <dt className="font-semibold sm:w-28 sm:shrink-0">
                  {niveau.libelle}
                </dt>
                <dd className="mt-1 sm:mt-0">{attente}</dd>
              </div>
            );
          })}
        </dl>
      </section>

      <div className="mt-10">
        <Markdown>{concept.corps}</Markdown>
      </div>

      {conceptsLies.length > 0 && (
        <section aria-labelledby="lies" className="mt-10">
          <h2 id="lies" className="text-lg font-semibold">
            Concepts liés
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {conceptsLies.map((lie) => (
              <li key={lie.id}>
                <Link
                  href={`/${domaine.id}/concepts/${lie.id}`}
                  className="inline-block rounded-full border border-border px-3 py-1 text-sm hover:border-accent"
                >
                  {lie.terme}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
