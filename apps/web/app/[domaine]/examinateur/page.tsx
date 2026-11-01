import type { Metadata } from "next";
import type { Flashcard } from "@mind-kata/core/evaluation";
import Link from "next/link";
import { Suspense } from "react";
import { Examinateur } from "@/components/examinateur/examinateur";
import { listerDomaines, trouverPack } from "@/lib/contenu";
import { exigerAcces } from "@/lib/acces/session";

export function generateStaticParams() {
  return listerDomaines()
    .filter((d) => trouverPack(d.id).flashcards.length > 0)
    .map((d) => ({ domaine: d.id }));
}

export const metadata: Metadata = {
  title: "Examinateur",
  robots: { index: false },
};

// Le cookie n'existe qu'à la requête : la garde est rendue à la demande, dans un
// Suspense, pendant que l'en-tête de la page reste statique.
async function Garde({
  domaine,
  cartes,
}: {
  domaine: Parameters<typeof Examinateur>[0]["domaine"];
  cartes: Flashcard[];
}) {
  await exigerAcces(`/${domaine.id}/examinateur`);
  return <Examinateur domaine={domaine} cartes={cartes} />;
}

export default async function PageExaminateur({
  params,
}: PageProps<"/[domaine]/examinateur">) {
  const { domaine, flashcards } = trouverPack((await params).domaine);
  return (
    <>
      <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
        <Link href={`/${domaine.id}`} className="hover:text-accent">
          {domaine.nom}
        </Link>
        <span> › Examinateur</span>
      </nav>
      <h1 className="mt-2 text-3xl font-semibold">Examinateur</h1>
      <div className="mt-6">
        <Suspense>
          <Garde
            domaine={{ id: domaine.id, niveaux: domaine.niveaux }}
            cartes={flashcards}
          />
        </Suspense>
      </div>
    </>
  );
}
