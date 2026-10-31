import { describe, expect, it } from "vitest";
import { schemaSimulation } from "./simulation";
import { domaineCuisine } from "./test/domaine-cuisine";

const schema = schemaSimulation(domaineCuisine);

const coupDeFeu = {
  id: "coup-de-feu",
  titre: "Le coup de feu du samedi soir",
  enonce: "Cent vingt couverts entre 20 h et 21 h, un commis absent.",
  chiffres: [{ libelle: "Couverts", valeur: "120 en une heure" }],
  recap: "Deux couverts par minute, une brigade amputée d'un poste.",
  relances: ["Qui prend le poste du commis ?", "Et si la plonge déborde ?"],
  grille: {
    commis: ["Tient son poste sans ralentir l'envoi."],
    "chef-de-partie": ["Réorganise les postes et prévient la salle."],
    chef: ["Simplifie la carte du soir pour tenir le rythme."],
  },
};

describe("schemaSimulation", () => {
  it("accepte une simulation complète", () => {
    const simulation = schema.parse(coupDeFeu);
    expect(simulation.signaux).toEqual([]);
  });

  it("exige une grille pour chaque niveau du domaine", () => {
    const { chef: _, ...grilleIncomplete } = coupDeFeu.grille;
    const resultat = schema.safeParse({
      ...coupDeFeu,
      grille: grilleIncomplete,
    });
    expect(resultat.error?.issues[0]?.path).toEqual(["grille", "chef"]);
  });

  it("refuse un niveau de grille sans attente", () => {
    const resultat = schema.safeParse({
      ...coupDeFeu,
      grille: { ...coupDeFeu.grille, commis: [] },
    });
    expect(resultat.error?.issues[0]?.message).toBe(
      "chaque niveau a au moins une attente",
    );
  });

  it("exige au moins une relance", () => {
    expect(schema.safeParse({ ...coupDeFeu, relances: [] }).success).toBe(
      false,
    );
  });
});
