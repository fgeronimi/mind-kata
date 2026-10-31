import type { Concept, Domaine } from "@mind-kata/core";
import { Markdown } from "@/components/markdown";

interface Props {
  domaine: Domaine;
  concept: Concept;
  conceptsLies: { id: string; terme: string }[];
}

export function FicheConcept({ concept }: Props) {
  return (
    <article>
      <h1 className="text-3xl font-semibold">{concept.terme}</h1>
      <Markdown>{concept.corps}</Markdown>
    </article>
  );
}
