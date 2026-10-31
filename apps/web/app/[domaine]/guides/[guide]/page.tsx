import type { Metadata } from "next";
import Link from "next/link";
import { Markdown } from "@/components/markdown";
import { listerDomaines, trouverGuide, trouverPack } from "@/lib/contenu";

export function generateStaticParams() {
  return listerDomaines().flatMap((d) =>
    trouverPack(d.id).guides.map((g) => ({ domaine: d.id, guide: g.id })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[domaine]/guides/[guide]">): Promise<Metadata> {
  const { domaine, guide } = await params;
  const trouve = trouverGuide(domaine, guide).guide;
  return { title: trouve.titre, description: trouve.resume };
}

export default async function PageGuide({
  params,
}: PageProps<"/[domaine]/guides/[guide]">) {
  const { domaine, guide } = await params;
  const { pack, guide: trouve } = trouverGuide(domaine, guide);

  return (
    <article>
      <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
        <Link href={`/${pack.domaine.id}`} className="hover:text-accent">
          {pack.domaine.nom}
        </Link>
        <span> › Guides</span>
      </nav>
      <h1 className="mt-2 text-3xl font-semibold">{trouve.titre}</h1>
      <div className="mt-8">
        <Markdown>{trouve.corps}</Markdown>
      </div>
    </article>
  );
}
