import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { COOKIE_ACCES, jetonValide, lireConfigAcces } from "./jeton";

// La vraie vérification, au plus près de la ressource protégée. proxy.ts ne fait
// qu'un premier tri : un contournement du proxy ne doit rien ouvrir.
export const accesValide = async (): Promise<boolean> => {
  // L'heure courante n'a de sens qu'à la requête : jamais au prérendu.
  await connection();
  const jeton = (await cookies()).get(COOKIE_ACCES)?.value;
  return jetonValide(jeton, lireConfigAcces().cle, Date.now());
};

export const exigerAcces = async (chemin: string): Promise<void> => {
  if (!(await accesValide())) {
    redirect(`/acces?suite=${encodeURIComponent(chemin)}`);
  }
};
