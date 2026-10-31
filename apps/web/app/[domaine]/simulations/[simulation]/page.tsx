import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Markdown } from "@/components/markdown";
import { listerDomaines, trouverPack, trouverSimulation } from "@/lib/contenu";

export function generateStaticParams() {
  return listerDomaines().flatMap((d) =>
    trouverPack(d.id).simulations.map((s) => ({
      domaine: d.id,
      simulation: s.id,
    })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[domaine]/simulations/[simulation]">): Promise<Metadata> {
  const { domaine, simulation } = await params;
  return { title: trouverSimulation(domaine, simulation).simulation.titre };
}

// Ce qui révèle la solution est replié : on s'entraîne d'abord sur l'énoncé.
function Repli({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <details className="group mt-4 rounded-lg border border-border">
      <summary className="cursor-pointer p-4 font-semibold group-open:border-b group-open:border-border">
        {titre}
      </summary>
      <div className="p-4">{children}</div>
    </details>
  );
}

export default async function PageSimulation({
  params,
}: PageProps<"/[domaine]/simulations/[simulation]">) {
  const { domaine, simulation } = await params;
  const { pack, simulation: s } = trouverSimulation(domaine, simulation);

  return (
    <article>
      <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
        <Link href={`/${pack.domaine.id}`} className="hover:text-accent">
          {pack.domaine.nom}
        </Link>
        <span> › Simulations</span>
      </nav>
      <h1 className="mt-2 text-3xl font-semibold">{s.titre}</h1>
      <p className="mt-4 leading-relaxed">{s.enonce}</p>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {s.chiffres.map((c) => (
          <div key={c.libelle} className="rounded-lg border border-border p-3">
            <dt className="text-sm text-muted">{c.libelle}</dt>
            <dd className="font-semibold">{c.valeur}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-10 text-xl font-semibold">
        Relances de l&apos;examinateur
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-6">
        {s.relances.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ol>

      <h2 className="mt-10 text-xl font-semibold">Corrigé</h2>
      <Repli titre="Récapitulatif attendu">
        <p className="leading-relaxed">{s.recap}</p>
      </Repli>
      <Repli titre="Grille par niveau">
        <dl className="space-y-4">
          {pack.domaine.niveaux.map((niveau) => (
            <div key={niveau.id}>
              <dt className="font-semibold">{niveau.libelle}</dt>
              <dd>
                <ul className="mt-1 list-disc space-y-1 pl-6">
                  {(s.grille[niveau.id] ?? []).map((attente) => (
                    <li key={attente}>{attente}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Repli>
      {s.signaux.length > 0 && (
        <Repli titre="Signaux d'alerte">
          <ul className="list-disc space-y-1 pl-6">
            {s.signaux.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </Repli>
      )}
      <Repli titre="Réponse modèle">
        <Markdown>{s.corps}</Markdown>
      </Repli>
    </article>
  );
}
