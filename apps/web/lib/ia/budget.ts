import { cout, coutMaximal, type MicroDollars } from "./cout";
import type { ModeleIA } from "./modele";

export interface Plafonds {
  coutParJour: MicroDollars;
  appelsParJour: number;
  coutParMois: MicroDollars;
}

// Un budget GCP alerte mais ne coupe pas : ces plafonds sont la vraie limite
// (ADR 0009). Marge sous les 2 € mensuels.
export const PLAFONDS: Plafonds = {
  coutParJour: 100_000,
  appelsParJour: 40,
  coutParMois: 1_800_000,
};

export interface Periodes {
  mois: string;
  jour: string;
}

// Stockage des totaux. reserver est atomique : deux appels simultanés ne peuvent pas
// passer tous les deux sous le plafond alors qu'un seul y tenait.
export interface Compteur {
  reserver(
    periodes: Periodes,
    montant: MicroDollars,
    plafonds: Plafonds,
  ): Promise<boolean>;
  corriger(periodes: Periodes, ecart: MicroDollars): Promise<void>;
}

export class BudgetEpuise extends Error {
  constructor() {
    super("Plafond de consommation de l'IA atteint.");
    this.name = "BudgetEpuise";
  }
}

// Jour et mois à l'heure de Paris : le plafond du jour se libère à minuit pour
// l'utilisateur, pas à 1 h ou 2 h du matin.
const formatParis = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const periodesDe = (date: Date): Periodes => {
  const partie = (type: Intl.DateTimeFormatPartTypes) =>
    formatParis.formatToParts(date).find((p) => p.type === type)?.value ?? "";
  return { mois: `${partie("year")}-${partie("month")}`, jour: partie("day") };
};

// Décorateur : le modèle renvoyé respecte le même contrat, avec les plafonds en plus.
// L'examinateur ne sait pas qu'il est limité, et le modèle ne sait pas qu'il est
// compté.
export const avecBudget = (
  modele: ModeleIA,
  compteur: Compteur,
  plafonds: Plafonds = PLAFONDS,
  maintenant: () => Date = () => new Date(),
): ModeleIA => ({
  id: modele.id,
  tarif: modele.tarif,
  async repondre(requete, options) {
    const periodes = periodesDe(maintenant());
    // On réserve le pire cas avant l'appel, puis on corrige avec le réel : le
    // plafond n'est jamais dépassé, même par l'appel qui le franchirait.
    const reserve = coutMaximal(modele.tarif, requete);
    if (!(await compteur.reserver(periodes, reserve, plafonds))) {
      throw new BudgetEpuise();
    }
    try {
      const reponse = await modele.repondre(requete, options);
      await compteur.corriger(
        periodes,
        cout(modele.tarif, reponse.consommation) - reserve,
      );
      return reponse;
    } catch (erreur) {
      // Échec : la réservation est rendue, l'appel reste compté dans le quota du jour.
      await compteur.corriger(periodes, -reserve);
      throw erreur;
    }
  },
});
