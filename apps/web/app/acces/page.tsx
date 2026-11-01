import type { Metadata } from "next";
import { Suspense } from "react";
import { FormulaireAcces } from "./formulaire-acces";

export const metadata: Metadata = {
  title: "Accès réservé",
  robots: { index: false },
};

export default function PageAcces() {
  return (
    <>
      <h1 className="text-3xl font-semibold">Accès réservé</h1>
      <p className="mt-2 text-muted">
        L&apos;examinateur IA est réservé aux détenteurs d&apos;un code
        d&apos;accès. Les fiches et les exercices éclair restent ouverts à tous.
      </p>
      {/* Le formulaire lit l'URL (page d'origine) : rendu à la requête, le reste de
          la page est statique. */}
      <Suspense>
        <FormulaireAcces />
      </Suspense>
    </>
  );
}
