import type { Metadata } from "next";
import { FicheConcept } from "@/components/fiche-concept";
import { listerDomaines, trouverConcept, trouverPack } from "@/lib/contenu";

export function generateStaticParams() {
  return listerDomaines().flatMap((d) =>
    trouverPack(d.id).concepts.map((c) => ({ domaine: d.id, concept: c.id })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[domaine]/concepts/[concept]">): Promise<Metadata> {
  const { domaine, concept } = await params;
  const trouve = trouverConcept(domaine, concept);
  return { title: trouve.concept.terme };
}

export default async function PageConcept({
  params,
}: PageProps<"/[domaine]/concepts/[concept]">) {
  const { domaine, concept } = await params;
  const { pack, concept: trouve } = trouverConcept(domaine, concept);
  const conceptsLies = trouve.liens.flatMap((id) => {
    const lie = pack.concepts.find((c) => c.id === id);
    return lie ? [{ id: lie.id, terme: lie.terme }] : [];
  });

  return (
    <FicheConcept
      domaine={pack.domaine}
      concept={trouve}
      conceptsLies={conceptsLies}
    />
  );
}
