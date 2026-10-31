import "server-only";

import { cheminDuPack, domainesDisponibles } from "@mind-kata/content";
import { chargerPack, type Pack } from "@mind-kata/core";
import { notFound } from "next/navigation";
import { cache } from "react";

// cache() de React : un pack est lu une seule fois par rendu, même si la page, le
// layout et generateMetadata le demandent chacun.
const lirePack = cache((domaine: string): Pack =>
  chargerPack(cheminDuPack(domaine)),
);

export const listerDomaines = (): Pack["domaine"][] =>
  domainesDisponibles().map((id) => lirePack(id).domaine);

export const trouverPack = (domaine: string): Pack => {
  if (!domainesDisponibles().includes(domaine)) notFound();
  return lirePack(domaine);
};

export const trouverConcept = (domaine: string, concept: string) => {
  const pack = trouverPack(domaine);
  const trouve = pack.concepts.find((c) => c.id === concept);
  if (!trouve) notFound();
  return { pack, concept: trouve };
};

export const trouverGuide = (domaine: string, guide: string) => {
  const pack = trouverPack(domaine);
  const trouve = pack.guides.find((g) => g.id === guide);
  if (!trouve) notFound();
  return { pack, guide: trouve };
};

export const trouverArchitecture = (domaine: string, architecture: string) => {
  const pack = trouverPack(domaine);
  const trouve = pack.architectures.find((a) => a.id === architecture);
  if (!trouve) notFound();
  return { pack, architecture: trouve };
};
