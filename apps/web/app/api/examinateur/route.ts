import { domainesDisponibles } from "@mind-kata/content";
import { z } from "zod";
import { accesValide } from "@/lib/acces/session";
import { trouverPack } from "@/lib/contenu";
import {
  jouerTour,
  LONGUEUR_MAX_MESSAGE,
  MAX_RELANCES,
} from "@/lib/examinateur/tour";
import { BudgetEpuise } from "@/lib/ia/budget";
import { modeleExaminateur } from "@/lib/ia/fabrique";

// L'historique vient du navigateur, qui garde la séance (ADR 0009) : il est borné ici,
// c'est ce qui limite la taille de chaque appel et le nombre de relances.
const schemaCorps = z.strictObject({
  domaine: z.string(),
  situation: z.string(),
  echanges: z
    .array(
      z.strictObject({
        role: z.enum(["candidat", "examinateur"]),
        texte: z.string().trim().min(1).max(LONGUEUR_MAX_MESSAGE),
      }),
    )
    .min(1)
    .max(2 * MAX_RELANCES + 1)
    .refine(
      (echanges) =>
        echanges.every(
          (m, i) => m.role === (i % 2 === 0 ? "candidat" : "examinateur"),
        ) && echanges.length % 2 === 1,
      "les échanges alternent, du candidat au candidat",
    ),
});

// Quand l'IA n'est pas disponible, le navigateur bascule sur le rapprochement
// lexical des exercices éclair (ADR 0008) : la réponse dit pourquoi.
const repli = (raison: "budget" | "indisponible", status: number) =>
  Response.json({ repli: raison }, { status });

// Route handler : l'équivalent d'un contrôleur, exécuté sur le serveur à chaque
// requête.
export async function POST(requete: Request) {
  if (!(await accesValide())) {
    return Response.json({ erreur: "Accès réservé." }, { status: 401 });
  }

  const corps = schemaCorps.safeParse(
    await requete.json().catch(() => undefined),
  );
  if (!corps.success) {
    return Response.json(
      { erreur: "Requête invalide.", details: z.treeifyError(corps.error) },
      { status: 400 },
    );
  }
  const { domaine, situation, echanges } = corps.data;
  if (!domainesDisponibles().includes(domaine)) {
    return Response.json({ erreur: "Domaine inconnu." }, { status: 404 });
  }
  const pack = trouverPack(domaine);
  const carte = pack.flashcards.find((c) => c.id === situation);
  if (!carte) {
    return Response.json({ erreur: "Situation inconnue." }, { status: 404 });
  }

  try {
    const tour = await jouerTour(
      modeleExaminateur(),
      carte,
      echanges,
      pack.domaine.niveaux,
      requete.signal,
    );
    return Response.json(tour);
  } catch (erreur) {
    if (erreur instanceof BudgetEpuise) return repli("budget", 429);
    console.error(erreur);
    return repli("indisponible", 503);
  }
}
