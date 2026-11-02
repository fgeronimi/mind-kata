// Partagées par le serveur, qui les applique, et le navigateur, qui les annonce : un
// fichier sans dépendance, pour que le client n'embarque pas la logique du tour.
export const MAX_RELANCES = 2;
export const LONGUEUR_MAX_MESSAGE = 2000;
// Une bulle lue à voix haute, rarement plus de quelques centaines de caractères : la
// borne limite ce qu'un seul appel peut consommer du quota de synthèse.
export const LONGUEUR_MAX_LECTURE = 1000;
