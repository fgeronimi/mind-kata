import type { Compteur, Periodes, Plafonds } from "./budget";
import type { MicroDollars } from "./cout";

interface Totaux {
  coutMois: MicroDollars;
  jours: Map<string, { cout: MicroDollars; appels: number }>;
}

// Pour les tests et le développement local : remis à zéro à chaque démarrage, il ne
// protège pas un déploiement (une instance Cloud Run redémarre souvent).
export const creerCompteurMemoire = (): Compteur & {
  totaux(periodes: Periodes): {
    coutMois: number;
    coutJour: number;
    appelsJour: number;
  };
} => {
  const parMois = new Map<string, Totaux>();
  const totauxDu = (mois: string): Totaux => {
    const existants = parMois.get(mois);
    if (existants) return existants;
    const nouveaux: Totaux = { coutMois: 0, jours: new Map() };
    parMois.set(mois, nouveaux);
    return nouveaux;
  };
  const jourDe = (t: Totaux, jour: string) =>
    t.jours.get(jour) ?? { cout: 0, appels: 0 };

  return {
    // Synchrone entre la lecture et l'écriture : atomique dans un seul processus.
    reserver(periodes: Periodes, montant: MicroDollars, plafonds: Plafonds) {
      const t = totauxDu(periodes.mois);
      const j = jourDe(t, periodes.jour);
      const accepte =
        t.coutMois + montant <= plafonds.coutParMois &&
        j.cout + montant <= plafonds.coutParJour &&
        j.appels + 1 <= plafonds.appelsParJour;
      if (accepte) {
        t.coutMois += montant;
        t.jours.set(periodes.jour, {
          cout: j.cout + montant,
          appels: j.appels + 1,
        });
      }
      return Promise.resolve(accepte);
    },
    corriger(periodes: Periodes, ecart: MicroDollars) {
      const t = totauxDu(periodes.mois);
      const j = jourDe(t, periodes.jour);
      t.coutMois += ecart;
      t.jours.set(periodes.jour, { ...j, cout: j.cout + ecart });
      return Promise.resolve();
    },
    totaux(periodes: Periodes) {
      const t = totauxDu(periodes.mois);
      const j = jourDe(t, periodes.jour);
      return { coutMois: t.coutMois, coutJour: j.cout, appelsJour: j.appels };
    },
  };
};
