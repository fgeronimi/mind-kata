import type { Metadata } from "next";
import Link from "next/link";
import { Entrainement } from "@/components/exercices/entrainement";
import { listerDomaines, trouverPack } from "@/lib/contenu";

export function generateStaticParams() {
  return listerDomaines()
    .filter((d) => trouverPack(d.id).flashcards.length > 0)
    .map((d) => ({ domaine: d.id }));
}

export const metadata: Metadata = { title: "Exercices éclair" };

// Composant serveur : le pack est lu au build, puis les situations sont transmises
// au composant client, qui gère toute la série dans le navigateur.
export default async function PageExercices({
  params,
}: PageProps<"/[domaine]/exercices">) {
  const { domaine, flashcards } = trouverPack((await params).domaine);
  return (
    <>
      <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
        <Link href={`/${domaine.id}`} className="hover:text-accent">
          {domaine.nom}
        </Link>
        <span> › Exercices éclair</span>
      </nav>
      <h1 className="mt-2 text-3xl font-semibold">Exercices éclair</h1>
      <p className="mt-2 text-muted">
        Une situation, votre réponse, puis l&apos;arbre attendu : la solution de
        base et les couches qui la précisent. Un élément ne compte que si celui
        dont il dépend a été cité.
      </p>
      <div className="mt-8">
        <Entrainement
          domaine={{
            id: domaine.id,
            niveaux: domaine.niveaux,
            categories: domaine.categories,
          }}
          cartes={flashcards}
        />
      </div>
    </>
  );
}
