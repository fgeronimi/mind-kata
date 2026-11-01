import type { Consommation, Requete, Tarif } from "./modele";

// Les coûts sont comptés en micro-dollars entiers : additionner des milliers de
// petits flottants ferait dériver le total. Commode : un tarif en dollars par
// million de jetons est aussi un coût en micro-dollars par jeton.
export type MicroDollars = number;

export const cout = (tarif: Tarif, c: Consommation): MicroDollars =>
  Math.ceil(c.jetonsEntree * tarif.entreeParMillion) +
  Math.ceil(c.jetonsSortie * tarif.sortieParMillion);

// Majorant des jetons d'une requête, avant l'appel : le nombre exact de jetons
// d'entrée n'est connu qu'après. Un jeton fait rarement moins de trois caractères, en
// français comme en anglais ; la sortie est plafonnée par maxJetonsSortie.
export const jetonsMaximaux = (requete: Requete): Consommation => {
  const caracteres =
    requete.systeme.length +
    requete.messages.reduce((total, m) => total + m.texte.length, 0);
  return {
    jetonsEntree: Math.ceil(caracteres / 3),
    jetonsSortie: requete.maxJetonsSortie,
  };
};

export const coutMaximal = (tarif: Tarif, requete: Requete): MicroDollars =>
  cout(tarif, jetonsMaximaux(requete));
