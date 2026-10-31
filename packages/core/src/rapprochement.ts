import type { Noeud } from "./flashcard";
import { normaliser } from "./normalisation";
import { type Chemin, parcourir } from "./score";

// Tout ce qui, dans une réponse, désigne un nœud : son mot, ses synonymes, et ses
// alternatives (citer Kafka là où RabbitMQ est attendu, c'est répondre à ce nœud).
const formulations = (noeud: Noeud): string[] =>
  [
    noeud.mot,
    ...noeud.synonymes,
    ...noeud.alternatives.flatMap((a) => [a.mot, ...a.synonymes]),
  ]
    .map(normaliser)
    .filter((f) => f !== "");

// Rapproche une réponse libre des nœuds de l'arbre. Purement lexical et déterministe :
// une proposition, que l'utilisateur corrige à la révélation.
export const reperer = (arbre: Noeud[], reponse: string): Set<Chemin> => {
  // Espaces aux bords : la recherche porte sur des mots entiers (« cache » ne doit
  // pas être trouvé dans « cacher »).
  const texte = ` ${normaliser(reponse)} `;
  return new Set(
    parcourir(arbre)
      .filter(({ noeud }) =>
        formulations(noeud).some((f) => texte.includes(` ${f} `)),
      )
      .map((n) => n.chemin),
  );
};
