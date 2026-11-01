import { FieldValue, type Firestore } from "@google-cloud/firestore";
import type { Compteur, Periodes, Plafonds } from "./budget";
import type { MicroDollars } from "./cout";

// Un document par mois, budget/AAAA-MM : { cout, jours: { JJ: { cout, appels } } }.
// Quelques dizaines de lectures et d'écritures par jour : dans les limites gratuites.
interface DocumentMois {
  cout?: number;
  jours?: Record<string, { cout?: number; appels?: number }>;
}

export const creerCompteurFirestore = (base: Firestore): Compteur => {
  const documentDu = (mois: string) => base.collection("budget").doc(mois);

  return {
    // Transaction : si un autre appel modifie le document entre la lecture et
    // l'écriture, Firestore rejoue la fonction avec les nouveaux totaux.
    reserver(periodes: Periodes, montant: MicroDollars, plafonds: Plafonds) {
      return base.runTransaction(async (transaction) => {
        const reference = documentDu(periodes.mois);
        const donnees = ((await transaction.get(reference)).data() ??
          {}) as DocumentMois;
        const jour = donnees.jours?.[periodes.jour] ?? {};
        const accepte =
          (donnees.cout ?? 0) + montant <= plafonds.coutParMois &&
          (jour.cout ?? 0) + montant <= plafonds.coutParJour &&
          (jour.appels ?? 0) + 1 <= plafonds.appelsParJour;
        if (accepte) {
          transaction.set(
            reference,
            {
              cout: FieldValue.increment(montant),
              jours: {
                [periodes.jour]: {
                  cout: FieldValue.increment(montant),
                  appels: FieldValue.increment(1),
                },
              },
            },
            { merge: true },
          );
        }
        return accepte;
      });
    },

    // Un incrément suffit : la correction ne dépend pas des totaux.
    async corriger(periodes: Periodes, ecart: MicroDollars) {
      await documentDu(periodes.mois).set(
        {
          cout: FieldValue.increment(ecart),
          jours: { [periodes.jour]: { cout: FieldValue.increment(ecart) } },
        },
        { merge: true },
      );
    },
  };
};
