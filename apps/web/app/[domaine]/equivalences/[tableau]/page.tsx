import type { Metadata } from "next";
import Link from "next/link";
import {
  listerDomaines,
  trouverEquivalences,
  trouverPack,
} from "@/lib/contenu";

export function generateStaticParams() {
  return listerDomaines().flatMap((d) =>
    trouverPack(d.id).equivalences.map((e) => ({
      domaine: d.id,
      tableau: e.id,
    })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[domaine]/equivalences/[tableau]">): Promise<Metadata> {
  const { domaine, tableau } = await params;
  const { equivalences } = trouverEquivalences(domaine, tableau);
  return { title: equivalences.titre, description: equivalences.description };
}

export default async function PageEquivalences({
  params,
}: PageProps<"/[domaine]/equivalences/[tableau]">) {
  const { domaine, tableau } = await params;
  const { pack, equivalences: e } = trouverEquivalences(domaine, tableau);

  return (
    <article>
      <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
        <Link href={`/${pack.domaine.id}`} className="hover:text-accent">
          {pack.domaine.nom}
        </Link>
        <span> › Équivalences</span>
      </nav>
      <h1 className="mt-2 text-3xl font-semibold">{e.titre}</h1>
      <p className="mt-2 text-muted">{e.description}</p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th
                scope="col"
                className="border border-border px-3 py-2 text-left"
              >
                Besoin
              </th>
              {e.colonnes.map((c) => (
                <th
                  key={c.id}
                  scope="col"
                  className="border border-border px-3 py-2 text-left"
                >
                  {c.libelle}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {e.lignes.map((ligne) => (
              <tr key={ligne.besoin}>
                <th
                  scope="row"
                  className="border border-border px-3 py-2 text-left font-semibold"
                >
                  {ligne.besoin}
                </th>
                {e.colonnes.map((c) => (
                  <td key={c.id} className="border border-border px-3 py-2">
                    {ligne.valeurs[c.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {e.notes.length > 0 && (
        <ul className="mt-6 list-disc space-y-1 pl-6 text-sm text-muted">
          {e.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
