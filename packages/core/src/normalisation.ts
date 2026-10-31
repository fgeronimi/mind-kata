// La décomposition NFD sépare la lettre de son accent (« é » → « e » + accent
// combinant), mais ne touche pas aux ligatures : on les traite à part.
const ligatures: Record<string, string> = { œ: "oe", æ: "ae", ß: "ss" };

// Prépare un texte pour la comparaison avec les mots d'un arbre de réponse : sans
// casse, sans accents, sans ponctuation, une seule espace entre les mots.
export const normaliser = (texte: string): string =>
  texte
    .toLowerCase()
    .replace(/[œæß]/g, (l) => ligatures[l] ?? l)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
