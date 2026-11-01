"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  COOKIE_ACCES,
  codeValide,
  creerJeton,
  DUREE_SESSION_MS,
  lireConfigAcces,
} from "@/lib/acces/jeton";
import { creerLimiteur } from "@/lib/acces/limiteur";

const limiteur = creerLimiteur({ tentatives: 5, fenetreMs: 15 * 60 * 1000 });

export interface EtatAcces {
  erreur?: string;
}

// Seul un chemin interne est accepté : sinon, un lien piégé
// (/acces?suite=https://ailleurs) renverrait vers un autre site après la saisie.
const suiteSure = (suite: string): string =>
  suite.startsWith("/") && !suite.startsWith("//") && !suite.startsWith("/\\")
    ? suite
    : "/";

// Cloud Run ajoute l'adresse du client à la fin de X-Forwarded-For : c'est la seule
// entrée fiable, les précédentes peuvent être envoyées par le client lui-même.
const origine = async (): Promise<string> =>
  (await headers()).get("x-forwarded-for")?.split(",").at(-1)?.trim() ??
  "inconnue";

export async function entrer(
  _precedent: EtatAcces,
  formulaire: FormData,
): Promise<EtatAcces> {
  const ip = await origine();
  const maintenant = Date.now();
  if (limiteur.bloque(ip, maintenant)) {
    return { erreur: "Trop de tentatives. Réessayez dans un quart d'heure." };
  }

  const { empreinte, cle } = lireConfigAcces();
  if (
    cle === "" ||
    !codeValide(String(formulaire.get("code") ?? ""), empreinte)
  ) {
    limiteur.echec(ip, maintenant);
    return { erreur: "Code incorrect." };
  }

  (await cookies()).set(COOKIE_ACCES, creerJeton(cle, maintenant), {
    // Inaccessible au JavaScript de la page, envoyé seulement en HTTPS en production,
    // et pas sur les requêtes déclenchées depuis un autre site.
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DUREE_SESSION_MS / 1000,
  });
  redirect(suiteSure(String(formulaire.get("suite") ?? "")));
}
