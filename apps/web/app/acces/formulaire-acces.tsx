"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { entrer } from "./actions";

export function FormulaireAcces() {
  const [etat, action, enCours] = useActionState(entrer, {});
  const suite = useSearchParams().get("suite") ?? "";

  return (
    <form action={action} className="mt-6 max-w-sm">
      <input type="hidden" name="suite" value={suite} />
      <label htmlFor="code" className="block font-semibold">
        Code d&apos;accès
      </label>
      {/* type password et autocomplete : le gestionnaire de mots de passe propose
          le code enregistré. */}
      <input
        id="code"
        name="code"
        type="password"
        required
        autoComplete="current-password"
        aria-describedby={etat.erreur ? "erreur-code" : undefined}
        className="mt-2 block w-full rounded-md border border-border bg-background p-2"
      />
      <p
        id="erreur-code"
        aria-live="polite"
        className="mt-2 text-sm text-red-700 dark:text-red-400"
      >
        {etat.erreur}
      </p>
      <button
        type="submit"
        disabled={enCours}
        className="mt-2 rounded-md bg-accent px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        Entrer
      </button>
    </form>
  );
}
