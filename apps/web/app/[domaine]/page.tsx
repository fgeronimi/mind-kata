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
  const { domaine, concepts } = trouverPack((await params).domaine);
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
    </>
  );
}
