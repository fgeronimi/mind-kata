import type { Consommation, ModeleIA, Requete, Tarif } from "./modele";

// Modèle simulé pour les tests et les parcours Playwright : réponses écrites
// d'avance, consommation fixe, aucun appel réseau.
export const creerModeleFaux = ({
  reponses,
  tarif = { entreeParMillion: 1, sortieParMillion: 2 },
  consommation = { jetonsEntree: 100, jetonsSortie: 50 },
}: {
  reponses: string[] | ((requete: Requete) => string);
  tarif?: Tarif;
  consommation?: Consommation;
}): ModeleIA & { requetes: Requete[] } => {
  const requetes: Requete[] = [];
  return {
    id: "faux/modele",
    tarif,
    requetes,
    repondre(requete, options) {
      requetes.push(requete);
      const texte =
        typeof reponses === "function"
          ? reponses(requete)
          : (reponses[requetes.length - 1] ?? "");
      options?.surTexte?.(texte);
      return Promise.resolve({ texte, consommation });
    },
  };
};
