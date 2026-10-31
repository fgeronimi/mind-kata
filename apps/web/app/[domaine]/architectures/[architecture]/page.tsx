import type { Metadata } from "next";
import Link from "next/link";
import { Markdown } from "@/components/markdown";
import {
  listerDomaines,
  trouverArchitecture,
  trouverPack,
} from "@/lib/contenu";

export function generateStaticParams() {
  return listerDomaines().flatMap((d) =>
    trouverPack(d.id).architectures.map((a) => ({
      domaine: d.id,
      architecture: a.id,
    })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[domaine]/architectures/[architecture]">): Promise<Metadata> {
  const { domaine, architecture } = await params;
  const trouve = trouverArchitecture(domaine, architecture).architecture;
  return { title: trouve.titre, description: trouve.probleme };
}

export default async function PageArchitecture({
  params,
}: PageProps<"/[domaine]/architectures/[architecture]">) {
  const { domaine, architecture } = await params;
  const { pack, architecture: trouve } = trouverArchitecture(
    domaine,
    architecture,
  );
  const concepts = trouve.concepts.flatMap((id) => {
    const concept = pack.concepts.find((c) => c.id === id);
    return concept ? [concept] : [];
  });

  return (
    <article>
      <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
        <Link href={`/${pack.domaine.id}`} className="hover:text-accent">
          {pack.domaine.nom}
        </Link>
        <span> › Architectures types</span>
      </nav>
      <h1 className="mt-2 text-3xl font-semibold">{trouve.titre}</h1>
      <p className="mt-2 text-lg text-muted">{trouve.probleme}</p>

      <section aria-labelledby="briques" className="mt-6">
        <h2 id="briques" className="font-semibold">
          Briques clés
        </h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {trouve.briques.map((brique) => (
            <li
              key={brique}
              className="rounded-md bg-black/5 px-2 py-1 text-sm dark:bg-white/10"
            >
              {brique}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8">
        <Markdown>{trouve.corps}</Markdown>
      </div>

      {concepts.length > 0 && (
        <section aria-labelledby="concepts" className="mt-10">
          <h2 id="concepts" className="text-lg font-semibold">
            Concepts mobilisés
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {concepts.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/${pack.domaine.id}/concepts/${c.id}`}
                  className="inline-block rounded-full border border-border px-3 py-1 text-sm hover:border-accent"
                >
                  {c.terme}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
