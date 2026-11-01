import type { Tour } from "@/lib/examinateur/tour";
import type { Message } from "@/lib/ia/modele";

export type Issue =
  | { type: "tour"; tour: Tour }
  | { type: "repli"; raison: "budget" | "indisponible" }
  | { type: "expire" };

// Toute réponse autre qu'un tour réussi devient une issue explicite : le chat ne
// plante jamais, il bascule sur le rapprochement par mots-clés.
export const demanderTour = async (
  domaine: string,
  situation: string,
  echanges: Message[],
): Promise<Issue> => {
  let reponse: Response;
  try {
    reponse = await fetch("/api/examinateur", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domaine, situation, echanges }),
    });
  } catch {
    return { type: "repli", raison: "indisponible" };
  }
  if (reponse.status === 401) return { type: "expire" };
  if (!reponse.ok) {
    const corps = (await reponse.json().catch(() => ({}))) as {
      repli?: string;
    };
    return {
      type: "repli",
      raison: corps.repli === "budget" ? "budget" : "indisponible",
    };
  }
  return { type: "tour", tour: (await reponse.json()) as Tour };
};
