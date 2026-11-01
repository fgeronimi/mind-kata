import { z } from "zod";
import { accesValide } from "@/lib/acces/session";
import { LONGUEUR_MAX_LECTURE } from "@/lib/examinateur/limites";
import { syntheseExaminateur, VoixNonConfiguree } from "@/lib/voix/fabrique";
import { QuotaVoixEpuise } from "@/lib/voix/quota";

const schemaCorps = z.strictObject({
  texte: z.string().trim().min(1).max(LONGUEUR_MAX_LECTURE),
});

// Le navigateur lit avec sa propre voix quand celle-ci n'est pas disponible : la
// réponse dit pourquoi.
const repli = (raison: "quota" | "indisponible", status: number) =>
  Response.json({ repli: raison }, { status });

export async function POST(requete: Request) {
  if (!(await accesValide())) {
    return Response.json({ erreur: "Accès réservé." }, { status: 401 });
  }
  const corps = schemaCorps.safeParse(
    await requete.json().catch(() => undefined),
  );
  if (!corps.success) {
    return Response.json({ erreur: "Requête invalide." }, { status: 400 });
  }

  try {
    const audio = await syntheseExaminateur().synthetiser(corps.data.texte);
    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (erreur) {
    if (erreur instanceof QuotaVoixEpuise) return repli("quota", 429);
    // Sans fournisseur, c'est le fonctionnement prévu, pas une panne à signaler.
    if (!(erreur instanceof VoixNonConfiguree)) console.error(erreur);
    return repli("indisponible", 503);
  }
}
