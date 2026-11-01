import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_ACCES, jetonValide, lireConfigAcces } from "@/lib/acces/jeton";

// Premier tri, sans aller plus loin que le cookie : une requête sans jeton valide ne
// déclenche ni rendu ni appel à l'IA. La garde de la page et celle de la route
// vérifient à nouveau, le proxy n'est pas la seule barrière.
export function proxy(requete: NextRequest) {
  const jeton = requete.cookies.get(COOKIE_ACCES)?.value;
  if (jetonValide(jeton, lireConfigAcces().cle, Date.now())) {
    return NextResponse.next();
  }
  if (requete.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ erreur: "Accès réservé." }, { status: 401 });
  }
  const acces = new URL("/acces", requete.url);
  acces.searchParams.set("suite", requete.nextUrl.pathname);
  return NextResponse.redirect(acces);
}

export const config = {
  matcher: ["/:domaine/examinateur/:path*", "/api/examinateur/:path*"],
};
