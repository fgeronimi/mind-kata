// Contrat entre l'examinateur et le modèle d'IA (ADR 0009) : l'examinateur ne connaît
// ni le fournisseur ni le modèle. Changer de modèle, c'est écrire un adaptateur qui
// respecte ce contrat, puis repasser le jeu d'évaluation.

// Dollars par million de jetons, tels que publiés par le fournisseur.
export interface Tarif {
  entreeParMillion: number;
  sortieParMillion: number;
}

export interface Consommation {
  jetonsEntree: number;
  // Jetons de raisonnement compris : ils sont facturés comme de la sortie.
  jetonsSortie: number;
}

export interface Message {
  role: "examinateur" | "candidat";
  texte: string;
}

export interface Requete {
  systeme: string;
  // Commence par le candidat : la question de départ fait partie du système.
  messages: Message[];
  maxJetonsSortie: number;
  // Schéma JSON imposé à la réponse, quand le texte doit être lu par le code.
  schemaJson?: Record<string, unknown>;
}

export interface Reponse {
  texte: string;
  consommation: Consommation;
}

export interface Options {
  // Reçoit le texte au fil de la génération, pour l'afficher sans attendre la fin.
  surTexte?: (morceau: string) => void;
  signal?: AbortSignal;
}

export interface ModeleIA {
  // Fournisseur et modèle, par exemple « vertex/gemini-… » : tracé avec la consommation.
  readonly id: string;
  readonly tarif: Tarif;
  repondre(requete: Requete, options?: Options): Promise<Reponse>;
}
