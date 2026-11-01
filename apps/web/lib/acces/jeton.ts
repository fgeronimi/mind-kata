import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE_ACCES = "mk_acces";
export const DUREE_SESSION_MS = 30 * 24 * 60 * 60 * 1000;

// Lu à chaque appel, pas à l'import : en production, les valeurs viennent de Secret
// Manager par les variables d'environnement de Cloud Run. Absentes, tout accès est
// refusé.
export const lireConfigAcces = () => ({
  empreinte: process.env["EXAMINATEUR_CODE_EMPREINTE"] ?? "",
  cle: process.env["EXAMINATEUR_CLE_SESSION"] ?? "",
});

// Le code s'affiche en groupes (abcd-efgh-…) : tirets, espaces et majuscules sont
// ignorés à la saisie.
export const normaliserCode = (saisie: string): string =>
  saisie.toLowerCase().replace(/[^a-z0-9]/g, "");

// Comparaison en temps constant : le temps de réponse ne révèle pas combien de
// caractères sont justes.
const egal = (a: string, b: string): boolean => {
  const tamponA = Buffer.from(a);
  const tamponB = Buffer.from(b);
  return tamponA.length === tamponB.length && timingSafeEqual(tamponA, tamponB);
};

// Une empreinte SHA-256 suffit : le code est aléatoire (80 bits), pas choisi par un
// humain, donc hors de portée d'une attaque par dictionnaire.
export const codeValide = (
  saisie: string,
  empreinteAttendue: string,
): boolean =>
  egal(
    createHash("sha256").update(normaliserCode(saisie)).digest("hex"),
    empreinteAttendue.trim(),
  );

const signer = (cle: string, expiration: number): string =>
  createHmac("sha256", cle)
    .update(`acces.${String(expiration)}`)
    .digest("base64url");

// Jeton sans état : la date d'expiration et sa signature. Rien à stocker côté
// serveur ; changer la clé de session révoque tous les jetons.
export const creerJeton = (cle: string, maintenant: number): string => {
  const expiration = maintenant + DUREE_SESSION_MS;
  return `${String(expiration)}.${signer(cle, expiration)}`;
};

export const jetonValide = (
  jeton: string | undefined,
  cle: string,
  maintenant: number,
): boolean => {
  if (!jeton || cle === "") return false;
  const [brut, signature, ...reste] = jeton.split(".");
  if (!brut || !signature || reste.length > 0) return false;
  const expiration = Number(brut);
  if (!Number.isSafeInteger(expiration) || expiration <= maintenant)
    return false;
  return egal(signature, signer(cle, expiration));
};
