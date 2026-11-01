import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
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
async function Garde({ domaine }: { domaine: string }) {
  await exigerAcces(`/${domaine}/examinateur`);
  return (
    <p className="mt-8 rounded-lg border border-border p-4">
      L&apos;examinateur arrive bientôt. En attendant, les{" "}
      <Link href={`/${domaine}/exercices`} className="text-accent underline">
        exercices éclair
      </Link>{" "}
      restent disponibles.
    </p>
  );
}

export default async function PageExaminateur({
  params,
}: PageProps<"/[domaine]/examinateur">) {
  const { domaine } = trouverPack((await params).domaine);
  return (
    <>
      <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
        <Link href={`/${domaine.id}`} className="hover:text-accent">
          {domaine.nom}
        </Link>
        <span> › Examinateur</span>
      </nav>
      <h1 className="mt-2 text-3xl font-semibold">Examinateur</h1>
      <Suspense>
        <Garde domaine={domaine.id} />
      </Suspense>
    </>
  );
}
