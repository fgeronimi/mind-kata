import type { Metadata } from "next";
import Link from "next/link";
import { listerDomaines, trouverPack } from "@/lib/contenu";

export function generateStaticParams() {
  return listerDomaines().map((d) => ({ domaine: d.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[domaine]">): Promise<Metadata> {
  const { domaine } = trouverPack((await params).domaine);
  return { title: domaine.nom, description: domaine.description };
}

export default async function PageDomaine({ params }: PageProps<"/[domaine]">) {
  const {
    domaine,
    concepts,
    guides,
    architectures,
    simulations,
    equivalences,
    flashcards,
  } = trouverPack((await params).domaine);
  const categories = domaine.categories
    .map((categorie) => ({
      ...categorie,
      concepts: concepts
        .filter((c) => c.categorie === categorie.id)
        .sort((a, b) => a.terme.localeCompare(b.terme, domaine.langue)),
    }))
    .filter((c) => c.concepts.length > 0);

  return (
    <>
      <h1 className="text-3xl font-semibold">{domaine.nom}</h1>
      <p className="mt-3 text-muted">{domaine.description}</p>

      {flashcards.length > 0 && (
        <Link
          href={`/${domaine.id}/exercices`}
          className="mt-6 inline-block rounded-md bg-accent px-4 py-2 font-semibold text-white"
        >
          S&apos;entraîner : {flashcards.length} exercices éclair
        </Link>
      )}

      {guides.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-semibold">Guides</h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {guides.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/${domaine.id}/guides/${g.id}`}
                  className="block h-full rounded-lg border border-border p-4 hover:border-accent"
                >
                  <span className="font-semibold">{g.titre}</span>
                  <p className="mt-1 text-sm text-muted">{g.resume}</p>
                </Link>
              </li>
            ))}
          </ol>
        </>
      )}

      {architectures.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-semibold">Architectures types</h2>
          <p className="mt-1 text-sm text-muted">
            Identifier le type de problème donne l&apos;architecture de départ ;
            on l&apos;adapte ensuite aux chiffres.
          </p>
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
            {architectures.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/${domaine.id}/architectures/${a.id}`}
                  className="block p-4 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <span className="font-semibold">{a.titre}</span>
                  <p className="mt-1 text-sm text-muted">{a.probleme}</p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {simulations.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-semibold">Simulations</h2>
          <ul className="mt-4 space-y-3">
            {simulations.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/${domaine.id}/simulations/${s.id}`}
                  className="block rounded-lg border border-border p-4 hover:border-accent"
                >
                  <span className="font-semibold">{s.titre}</span>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">
                    {s.enonce}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="mt-10 text-xl font-semibold">Concepts</h2>
      <div className="mt-4 space-y-8">
        {categories.map((categorie) => (
          <section key={categorie.id} aria-labelledby={`cat-${categorie.id}`}>
            <h3 id={`cat-${categorie.id}`} className="font-semibold">
              {categorie.libelle}
            </h3>
            {categorie.description && (
              <p className="text-sm text-muted">{categorie.description}</p>
            )}
            <ul className="mt-2 flex flex-wrap gap-2">
              {categorie.concepts.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/${domaine.id}/concepts/${c.id}`}
                    className="inline-block rounded-full border border-border px-3 py-1 text-sm hover:border-accent"
                  >
                    {c.terme}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {equivalences.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-semibold">Équivalences</h2>
          <ul className="mt-4 space-y-3">
            {equivalences.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/${domaine.id}/equivalences/${e.id}`}
                  className="block rounded-lg border border-border p-4 hover:border-accent"
                >
                  <span className="font-semibold">{e.titre}</span>
                  <p className="mt-1 text-sm text-muted">{e.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
