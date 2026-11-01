import { type Compteur, type Plafonds, periodesDe } from "@/lib/ia/budget";
import type { Synthese } from "./synthese";

// Comptés en caractères, l'unité de facturation de la synthèse. Le premier million de
// caractères du mois est gratuit (voix Chirp 3 HD) : le plafond reste en dessous, la
// lecture ne coûte donc rien (ADR 0011). Une séance lit environ 3 000 caractères en
// une vingtaine d'appels.
export const PLAFONDS_VOIX: Plafonds = {
  coutParJour: 60_000,
  appelsParJour: 500,
  coutParMois: 900_000,
};

export class QuotaVoixEpuise extends Error {
  constructor() {
    super("Plafond mensuel de synthèse vocale atteint.");
    this.name = "QuotaVoixEpuise";
  }
}

// Décorateur, comme avecBudget : le coût est connu avant l'appel, rien à corriger
// sauf en cas d'échec.
export const avecQuota = (
  synthese: Synthese,
  compteur: Compteur,
  plafonds: Plafonds = PLAFONDS_VOIX,
  maintenant: () => Date = () => new Date(),
): Synthese => ({
  id: synthese.id,
  async synthetiser(texte) {
    const periodes = periodesDe(maintenant());
    if (!(await compteur.reserver(periodes, texte.length, plafonds))) {
      throw new QuotaVoixEpuise();
    }
    try {
      return await synthese.synthetiser(texte);
    } catch (erreur) {
      await compteur.corriger(periodes, -texte.length);
      throw erreur;
    }
  },
});
