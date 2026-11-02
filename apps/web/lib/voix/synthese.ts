// Même principe que ModeleIA : l'examinateur ne connaît que ce contrat, le prestataire
// n'est connu que de la fabrique.
export interface Synthese {
  id: string;
  // Audio MP3, prêt à être joué par le navigateur.
  synthetiser(texte: string): Promise<Uint8Array<ArrayBuffer>>;
}
