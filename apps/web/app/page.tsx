import Link from "next/link";
import { listerDomaines } from "@/lib/contenu";

export default function Accueil() {
  const domaines = listerDomaines();
  return (
    <>
      <h1 className="text-3xl font-semibold">Mind Kata</h1>
      <p className="mt-3 text-muted">
        S&apos;entraîner par la pratique : des concepts déclinés par niveau, des
        exercices dont la réponse est un raisonnement, des simulations
        d&apos;entretien.
      </p>
      <ul className="mt-10 space-y-4">
        {domaines.map((d) => (
          <li key={d.id}>
            <Link
              href={`/${d.id}`}
              className="block rounded-lg border border-border p-5 hover:border-accent"
            >
              <span className="text-lg font-semibold">{d.nom}</span>
              <p className="mt-1 text-sm text-muted">{d.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
