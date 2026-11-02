import type { Metadata } from "next";
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
async function Garde(props: Parameters<typeof Examinateur>[0]) {
  await exigerAcces(`/${props.domaine.id}/examinateur`);
  return <Examinateur {...props} />;
}

export default async function PageExaminateur({
  params,
}: PageProps<"/[domaine]/examinateur">) {
  const { domaine, flashcards, concepts } = trouverPack((await params).domaine);
  return (
    <>
      <nav
        aria-label="Fil d'Ariane"
        className="text-sm text-muted print:hidden"
      >
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
            termes={Object.fromEntries(concepts.map((c) => [c.id, c.terme]))}
          />
        </Suspense>
      </div>
    </>
  );
}
