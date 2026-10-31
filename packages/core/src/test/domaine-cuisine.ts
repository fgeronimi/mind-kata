import { type Domaine, schemaDomaine } from "../domaine";

// Domaine de test sans rapport avec le system design : si le moteur l'accepte, il
// ne dépend d'aucun vocabulaire métier.
export const domaineCuisine: Domaine = schemaDomaine.parse({
  id: "cuisine",
  nom: "Cuisine",
  langue: "fr",
  description: "Techniques de base de la cuisine professionnelle.",
  niveaux: [
    { id: "commis", libelle: "Commis" },
    { id: "chef-de-partie", libelle: "Chef de partie" },
    { id: "chef", libelle: "Chef" },
  ],
  categories: [
    { id: "sauces", libelle: "Sauces" },
    { id: "cuissons", libelle: "Cuissons" },
  ],
  types: ["concept", "flashcard"],
});
